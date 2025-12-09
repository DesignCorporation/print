import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, ShoppingCart, Users, Settings, Package } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Check Role
  // @ts-ignore
  if (session?.user?.role !== 'ADMIN') {
    redirect('/'); // Or show 403 page
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 text-zinc-400 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
            <span className="text-white font-bold text-xl">Admin Panel</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                <LayoutDashboard size={20} />
                Дашборд
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-800 text-white font-medium">
                <ShoppingCart size={20} />
                Заказы
            </Link>
            <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                <Package size={20} />
                Товары
            </Link>
            <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                <Users size={20} />
                Клиенты
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors">
                <Settings size={20} />
                Настройки
            </Link>
        </nav>

        <div className="p-4 border-t border-zinc-800">
            <Link href="/" className="text-xs hover:text-white">← Вернуться на сайт</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
