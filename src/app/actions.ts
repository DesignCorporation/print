'use server';

import { CartItem } from '@/lib/store';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { handleError } from '@/lib/errors';
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from '@/lib/email';
import { logger } from '@/lib/logger';
import { checkLimit, apiLimiter } from '@/lib/rate-limit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any, // Cast to any to avoid strict version check fail on build without install
});

type CheckoutData = {
  email: string;
  name: string;
  companyName?: string;
  nip?: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  cartItems: CartItem[];
  totalPrice: number;
};

export async function createOrder(data: CheckoutData) {
  try {
    const limit = await checkLimit(apiLimiter, `order:${data.email}`);
    if (!limit.success) {
      return { success: false, error: 'Слишком много запросов. Попробуйте позже.' };
    }

    // 1. Find or Create User (Simplified logic)
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          companyName: data.companyName,
          vatNumber: data.nip,
          phone: data.phone,
          passwordHash: 'placeholder',
          role: 'CUSTOMER'
        }
      });
    }

    // 2. Create Address
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        type: 'SHIPPING',
        fullName: data.name,
        companyName: data.companyName,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        country: 'Poland'
      }
    });

    // Prepare items with quantities and totals
    const preparedItems = data.cartItems.map(item => {
      const optionsJson = JSON.stringify(item.options);
      const qtyVal = parseInt(item.options?.quantity || '1', 10);
      const qtyUnits = Number.isFinite(qtyVal) && qtyVal > 0 ? qtyVal : 1;
      const lineTotalNet = item.price * qtyUnits;
      return {
        productId: Number(item.productId) || 1,
        productNameSnapshot: item.title,
        options: optionsJson,
        quantity: qtyUnits,
        unitNetPrice: item.price,
        totalNet: lineTotalNet,
        files: item.files && item.files.length
          ? {
              create: item.files.map((file) => ({
                url: file.url,
                originalName: file.name,
                mimeType: file.type,
                size: file.size,
                usage: 'ARTWORK',
                user: { connect: { id: user.id } },
              })),
            }
          : undefined,
      };
    });

    const summedNet = preparedItems.reduce((sum, it) => sum + Number(it.totalNet || 0), 0);
    const totalNet = summedNet;
    const totalVat = totalNet * 0.23;
    const totalGross = totalNet + totalVat;

    // 3. Create Order
    const orderNumber = `PD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*10000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING_PAYMENT',
        totalNet,
        totalVat,
        totalGross,
        billingAddressId: address.id,
        shippingAddressId: address.id,
        items: {
          create: preparedItems
        }
      }
    });

    logger.info('order.created', { orderId: order.id, orderNumber: order.orderNumber, user: user.email });

    // fire-and-forget emails
    sendOrderConfirmationEmail(user.email, order.orderNumber).catch((err) =>
      console.error('Failed to send order confirmation', err)
    );
    sendOrderNotificationToAdmin(order.orderNumber, user.email).catch((err) =>
      console.error('Failed to notify admin', err)
    );

    return { success: true, orderId: order.id, orderNumber };

  } catch (error) {
    logger.error('order.create_failed', { error });
    return handleError(error, 'Не удалось создать заказ');
  }
}

export async function createStripeSession(orderId: number) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, user: true }
    });

    if (!order) throw new Error('Order not found');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: order.items.map(item => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: item.productNameSnapshot,
            description: `Options: ${item.options}`,
          },
          unit_amount: Math.max(200, Math.round(Number(item.totalNet) * 1.23 * 100)), // >= 2 PLN
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/order-success?id=${order.orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout?canceled=true`,
      metadata: {
        orderId: order.id.toString(),
        orderNumber: order.orderNumber
      },
      customer_email: order.user.email
    });

    logger.info('stripe.session.created', { orderId, sessionId: session.id });

    return { success: true, url: session.url };
  } catch (error) {
    logger.error('stripe.session_failed', { error, orderId });
    return handleError(error, 'Не удалось инициировать оплату');
  }
}
