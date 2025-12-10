'use client';

import { useCartStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

        {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 mb-6">Ваша корзина пуста</p>
                <Link href="/products" className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">
                    Перейти в каталог
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-6 items-start">
                            {/* Image Placeholder */}
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0"></div>
                            
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                                <div className="text-sm text-gray-500 space-y-1">
                                    {Object.entries(item.options).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                            <span className="font-medium text-gray-700">{key}:</span>
                                            <span>{value}</span>
                                        </div>
                                    ))}
                                    {item.files && item.files.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            <div className="text-xs font-semibold text-gray-700">Файлы:</div>
                                            {item.files.map((file) => (
                                                <a
                                                    key={file.key}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-xs text-brand-600 hover:underline block"
                                                >
                                                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-4">
                                <span className="font-bold text-xl text-brand-900">{item.price} zł</span>
                                <button 
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Итого</h2>
                        
                        <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-100 pb-6">
                            <div className="flex justify-between">
                                <span>Сумма (Netto):</span>
                                <span>{totalPrice().toFixed(2)} zł</span>
                            </div>
                            <div className="flex justify-between">
                                <span>VAT (23%):</span>
                                <span>{(totalPrice() * 0.23).toFixed(2)} zł</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2">
                                <span>Всего к оплате:</span>
                                <span>{(totalPrice() * 1.23).toFixed(2)} zł</span>
                            </div>
                        </div>

                        <Link 
                            href="/checkout" 
                            className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                        >
                            Оформить заказ
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
