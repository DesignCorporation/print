'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!email || !password) {
    return { error: 'Заполните все поля' };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: 'Пользователь с таким email уже существует' };
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
}
