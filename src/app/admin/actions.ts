'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export async function updateOrderStatus(orderId: number, status: string): Promise<void> {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);

    logger.info('order.status_updated', { orderId, status });
  } catch (error) {
    logger.error('order.status_update_failed', { error, orderId, status });
    handleError(error, 'Не удалось обновить статус заказа');
  }
}
