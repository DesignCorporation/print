'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('UNAUTHORIZED');
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const name = (formData.get('name') as string) || '';
  const lastName = (formData.get('lastName') as string) || '';
  const phone = (formData.get('phone') as string) || '';
  const companyName = (formData.get('companyName') as string) || '';
  const companyStreet = (formData.get('companyStreet') as string) || '';
  const companyCity = (formData.get('companyCity') as string) || '';
  const companyPostalCode = (formData.get('companyPostalCode') as string) || '';
  const companyCountry = (formData.get('companyCountry') as string) || '';
  const vatNumber = (formData.get('vatNumber') as string) || '';

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      lastName,
      phone,
      companyName,
      companyStreet,
      companyCity,
      companyPostalCode,
      companyCountry,
      vatNumber,
    },
  });

  revalidatePath('/account');
  revalidatePath('/account/profile');
}

export async function changePassword(formData: FormData) {
  const user = await requireUser();
  const current = (formData.get('currentPassword') as string) || '';
  const next = (formData.get('newPassword') as string) || '';

  if (!next || next.length < 6) {
    throw new Error('Пароль должен быть не короче 6 символов');
  }

  const isPlaceholder = !user.passwordHash || user.passwordHash === 'placeholder';
  if (!isPlaceholder) {
    const match = await bcrypt.compare(current, user.passwordHash);
    if (!match) throw new Error('Текущий пароль неверный');
  }

  const hash = await bcrypt.hash(next, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
}

export async function addAddress(formData: FormData) {
  const user = await requireUser();
  const firstName = ((formData.get('firstName') as string) || '').trim();
  const lastName = ((formData.get('lastName') as string) || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || (formData.get('fullName') as string) || '';
  const street = (formData.get('street') as string) || '';
  const city = (formData.get('city') as string) || '';
  const postalCode = (formData.get('postalCode') as string) || '';
  const country = (formData.get('country') as string) || 'Poland';
  const companyName = (formData.get('companyName') as string) || '';
  const phone = ((formData.get('phone') as string) || '').trim();

  if (!fullName || !street || !city || !postalCode) {
    throw new Error('Заполните обязательные поля');
  }

  const hasDefault = await prisma.address.findFirst({ where: { userId: user.id, isDefault: true } });

  await prisma.address.create({
    data: {
      userId: user.id,
      type: 'SHIPPING',
      fullName,
      phone,
      companyName,
      street,
      city,
      postalCode,
      country,
      isDefault: !hasDefault,
    },
  });

  revalidatePath('/account/addresses');
}

export async function updateAddress(formData: FormData) {
  const user = await requireUser();
  const addressId = Number(formData.get('id'));
  if (!addressId) throw new Error('Адрес не найден');

  const firstName = ((formData.get('firstName') as string) || '').trim();
  const lastName = ((formData.get('lastName') as string) || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || (formData.get('fullName') as string) || '';
  const companyName = (formData.get('companyName') as string) || '';
  const street = (formData.get('street') as string) || '';
  const city = (formData.get('city') as string) || '';
  const postalCode = (formData.get('postalCode') as string) || '';
  const country = (formData.get('country') as string) || 'Poland';
  const phone = ((formData.get('phone') as string) || '').trim();

  await prisma.address.update({
    where: { id: addressId, userId: user.id },
    data: { fullName, companyName, street, city, postalCode, country, phone },
  });

  revalidatePath('/account/addresses');
}

export async function setDefaultAddress(addressId: number) {
  const user = await requireUser();
  const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
  if (!address) throw new Error('Адрес не найден');

  await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  await prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
  revalidatePath('/account/addresses');
}

export async function deleteAddress(addressId: number) {
  const user = await requireUser();
  const address = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
  if (!address) throw new Error('Адрес не найден');
  const inOrders = await prisma.order.count({
    where: {
      OR: [{ billingAddressId: addressId }, { shippingAddressId: addressId }],
    },
  });
  if (inOrders > 0) {
    // Уже использован в заказах — не удаляем, но и не падаем
    revalidatePath('/account/addresses');
    return;
  }
  await prisma.address.delete({ where: { id: addressId } });
  revalidatePath('/account/addresses');
}
