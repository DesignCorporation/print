'use server';

import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';
import { sendWelcomeEmail } from '@/lib/email';
import { logger } from '@/lib/logger';

export async function registerUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password) {
      return { success: false, error: 'Заполните все поля' };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'Пользователь с таким email уже существует' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    });

    logger.info('user.registered', { email });

    // fire-and-forget welcome email
    sendWelcomeEmail(user.email, user.name || undefined).catch((err) =>
      console.error('Failed to send welcome email', err)
    );

    return { success: true };
  } catch (error) {
    logger.error('user.register_failed', { error, email: formData.get('email') as string });
    return handleError(error, 'Не удалось зарегистрировать пользователя');
  }
}
