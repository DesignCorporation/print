import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminDashboardData } from '@/lib/admin-dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await getAdminDashboardData();
    return NextResponse.json(data);
  } catch (e) {
    console.error('admin dashboard api error', e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
