'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

  } catch (error) {
    handleError(error, 'Не удалось обновить статус заказа');
  }
}
