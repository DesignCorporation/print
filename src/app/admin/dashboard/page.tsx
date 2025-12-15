import { getAdminDashboardData } from '@/lib/admin-dashboard';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const data = await getAdminDashboardData();
  return <DashboardClient initialData={data} />;
}
