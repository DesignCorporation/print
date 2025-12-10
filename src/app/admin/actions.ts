'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function updateOrderStatus(orderId: number, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}
