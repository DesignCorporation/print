import Link from 'next/link';
import { Package, FileText, User, MapPin, Shield } from 'lucide-react';

type Props = {
  name?: string | null;
  email?: string | null;
  active: 'orders' | 'profile' | 'invoices' | 'addresses' | 'security';
};

export function AccountSidebar({ name, email, active }: Props) {
  const linkClass = (key: Props['active']) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium ${
      active === key
        ? 'bg-brand-50 text-brand-700'
        : 'text-gray-600 hover:bg-gray-50'
    }`;

  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-xl border border-gray-200 h-fit">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
          <User size={24} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{name || 'Клиент'}</p>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Link href="/account" className={linkClass('orders')}>
          <Package size={18} />
          Мои заказы
        </Link>
        <Link href="/account/profile" className={linkClass('profile')}>
          <User size={18} />
          Профиль
        </Link>
        <Link href="/account/addresses" className={linkClass('addresses')}>
          <MapPin size={18} />
          Адреса
        </Link>
        <Link href="/account/invoices" className={linkClass('invoices')}>
          <FileText size={18} />
          Фактуры
        </Link>
        <Link href="/account/security" className={linkClass('security')}>
          <Shield size={18} />
          Безопасность
        </Link>
      </nav>
    </aside>
  );
}
