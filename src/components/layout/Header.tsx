'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, Package, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering default state on server
  const count = mounted ? items.length : 0;
  const total = mounted ? totalPrice() : 0;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Catalog */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center text-white">
              <Package size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-900">Print.DesignCorp</span>
          </Link>

          <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors bg-gray-100 px-4 py-2 rounded-full hover:bg-brand-50">
            <Menu size={18} />
            <span>Каталог</span>
          </button>
        </div>

        {/* Center: Search */}
        <div className="hidden md:block flex-1 max-w-lg mx-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Поиск продукции (напр. Визитки)..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Link href="/cart" className="flex items-center gap-2 group">
            <div className="relative">
              <ShoppingCart className="text-gray-600 group-hover:text-brand-600 transition-colors" size={24} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {count}
                </span>
              )}
            </div>
            <div className="hidden lg:block text-right">
              <span className="block text-xs text-gray-500">Корзина</span>
              <span className="block text-sm font-bold text-gray-900">{total.toFixed(2)} zł</span>
            </div>
          </Link>

          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-brand-50">
                  <User size={20} />
                </div>
                <div className="hidden lg:block text-left">
                  <span className="block text-xs text-gray-500">Личный кабинет</span>
                  <span className="block text-sm font-medium">{session.user?.name || 'Мой профиль'}</span>
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors"
                type="button"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-brand-50">
                  <LogOut size={20} />
                </div>
                <span className="hidden lg:block text-sm font-medium">Выйти</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-brand-600 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-brand-50">
                <User size={20} />
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-xs text-gray-500">Личный кабинет</span>
                <span className="block text-sm font-medium">Войти</span>
              </div>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
