import React from 'react';
import { prisma } from './prisma';
import { InvoiceDocument } from './invoice-pdf';
import { pdf } from '@react-pdf/renderer';
import path from 'path';
import { promises as fs } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || '/opt/print-designcorp/uploads';

export async function generateInvoiceForOrder(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: { include: { product: true, files: true } },
      billingAddress: true,
    },
  });

  if (!order) throw new Error('Order not found');

  const existing = await prisma.invoice.findFirst({
    where: { orderId },
    include: { file: true },
  });

  if (existing?.file) {
    return existing;
  }

  const invoiceNumber = `INV-${order.orderNumber}`;
  const issueDate = new Date();
  const issueDateStr = issueDate.toISOString().slice(0, 10);
  const dueDate = new Date(issueDate);
  dueDate.setDate(issueDate.getDate() + 7);

  const buyerName = [order.user.name, order.user.lastName].filter(Boolean).join(' ') || order.user.email;
  const buyerCompany = order.billingAddress.companyName || order.user.companyName || buyerName;
  const buyerPhone = order.billingAddress.phone || order.user.phone || undefined;

  const doc = (
    <InvoiceDocument
      invoiceNumber={invoiceNumber}
      issueDate={issueDateStr}
      saleDate={issueDateStr}
      dueDate={dueDate.toISOString().slice(0, 10)}
      paymentMethod="Przelew"
      vatRate={23}
      sellerContacts={[
        'info@designcorp.eu',
        'designcorp.eu',
      ]}
      seller={{
        name: 'Print DesignCorp',
        address: 'ul. Przykładowa 1',
        city: 'Wroclaw',
        postalCode: '50-001',
        country: 'Poland',
        vatNumber: 'PL0000000000',
        bankAccount: '26 1020 5226 0000 0602 0582 0016, PKO Bank Polski',
        email: 'info@designcorp.eu',
        website: 'print.designcorp.eu',
      }}
      buyer={{
        name: buyerName,
        companyName: buyerCompany,
        address: order.billingAddress.street,
        city: order.billingAddress.city,
        postalCode: order.billingAddress.postalCode,
        country: order.billingAddress.country,
        phone: buyerPhone,
        vatNumber: order.billingAddress.companyName ? order.user.vatNumber || undefined : undefined,
      }}
      items={order.items.map((it) => {
        const totalNet = Number(it.totalNet);
        const vat = totalNet * 0.23;
        return {
          name: it.productNameSnapshot,
          quantity: it.quantity,
          unitNet: Number(it.unitNetPrice),
          totalNet,
          vat,
          totalGross: totalNet + vat,
        };
      })}
      totalNet={Number(order.totalNet)}
      totalVat={Number(order.totalVat)}
      totalGross={Number(order.totalGross)}
      currency={order.currency}
    />
  );

  const stream = await pdf(doc).toBuffer();

  const buf: Buffer = await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });

  const dated = issueDate.toISOString().slice(0, 10);
  const relPath = path.join('invoices', dated, `${invoiceNumber}.pdf`);
  const fullPath = path.join(UPLOAD_DIR, relPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buf);

  const file = await prisma.file.create({
    data: {
      url: `/api/uploads/${encodeURIComponent(relPath)}`,
      originalName: `${invoiceNumber}.pdf`,
      mimeType: 'application/pdf',
      size: buf.length,
      usage: 'INVOICE',
      userId: order.userId,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      orderId,
      invoiceNumber,
      issueDate,
      totalNet: order.totalNet,
      totalVat: order.totalVat,
      totalGross: order.totalGross,
      currency: order.currency,
      status: 'ISSUED',
      fileId: file.id,
    },
    include: { file: true, order: true },
  });

  return invoice;
}
