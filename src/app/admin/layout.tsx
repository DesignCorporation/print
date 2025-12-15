import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminNav from './Nav';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-zinc-900 text-zinc-400 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <span className="text-white font-bold text-xl">Admin Panel</span>
        </div>

        <AdminNav />

        <div className="p-4 border-t border-zinc-800">
          <Link href="/" className="text-xs hover:text-white">
            ← Вернуться на сайт
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
