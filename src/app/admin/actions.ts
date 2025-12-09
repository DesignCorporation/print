'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function updateOrderStatus(orderId: number, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}
