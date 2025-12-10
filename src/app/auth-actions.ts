'use server';

import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';

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

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    });

    return { success: true };
  } catch (error) {
    return handleError(error, 'Не удалось зарегистрировать пользователя');
  }
}
