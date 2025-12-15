import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ addresses: [], user: null });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      phone: true,
      companyName: true,
      vatNumber: true,
    },
  });
  if (!user) return NextResponse.json({ addresses: [], user: null });

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      fullName: true,
      companyName: true,
      street: true,
      city: true,
      postalCode: true,
      country: true,
      isDefault: true,
      phone: true,
    },
  });

  return NextResponse.json({ addresses, user });
}
