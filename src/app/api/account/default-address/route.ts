import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ success: false }, { status: 401 });

  const { addressId } = await req.json();
  if (!addressId) return NextResponse.json({ success: false, error: 'addressId required' }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ success: false }, { status: 401 });

  const addr = await prisma.address.findFirst({ where: { id: addressId, userId: user.id } });
  if (!addr) return NextResponse.json({ success: false, error: 'address not found' }, { status: 404 });

  await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  await prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });

  return NextResponse.json({ success: true });
}
