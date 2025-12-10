import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { generateInvoiceForOrder } from '@/lib/invoice';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod: 'ONLINE', // or parse from session
          paymentReference: session.payment_intent as string
        }
      });

      try {
        await generateInvoiceForOrder(parseInt(orderId));
      } catch (err) {
        console.error('invoice.generate.failed', err);
      }

      console.log(`Order ${orderId} marked as PAID`);
    }
  }

  return NextResponse.json({ received: true });
}
