'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Users, Settings, Package } from 'lucide-react';
import clsx from 'clsx';

export default function AdminNav() {
  const pathname = usePathname() || '';

  const navClass = (path: string) =>
    clsx(
      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
      pathname.startsWith(path)
        ? 'bg-zinc-800 text-white font-medium'
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
    );

  return (
    <nav className="flex-grow p-4 space-y-2">
      <Link href="/admin/dashboard" className={navClass('/admin/dashboard')}>
        <LayoutDashboard size={20} />
        Дашборд
      </Link>
      <Link href="/admin/orders" className={navClass('/admin/orders')}>
        <ShoppingCart size={20} />
        Заказы
      </Link>
      <Link href="/admin/products" className={navClass('/admin/products')}>
        <Package size={20} />
        Товары
      </Link>
      <Link href="/admin/users" className={navClass('/admin/users')}>
        <Users size={20} />
        Клиенты
      </Link>
      <Link href="/admin/settings" className={navClass('/admin/settings')}>
        <Settings size={20} />
        Настройки
      </Link>
    </nav>
  );
}
