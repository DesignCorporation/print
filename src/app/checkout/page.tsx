'use client';

import { useCartStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { createOrder, createStripeSession } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <p>Ваша корзина пуста</p>
            </div>
            <Footer />
        </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        email: formData.get('email') as string,
        name: formData.get('name') as string,
        companyName: formData.get('companyName') as string,
        nip: formData.get('nip') as string,
        phone: formData.get('phone') as string,
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        postalCode: formData.get('postalCode') as string,
        cartItems: items,
        totalPrice: totalPrice()
    };

    // 1. Create Order in DB
    const res = await createOrder(data);

    if (res.success && res.orderId) {
        // 2. Create Stripe Session
        const stripeRes = await createStripeSession(res.orderId);
        
        if (stripeRes.url) {
            clearCart();
            // Redirect to Stripe
            window.location.href = stripeRes.url;
        } else {
            alert('Ошибка создания платежа: ' + stripeRes.error);
            // Fallback to success page if payment fails init? Or stay here?
            // For now, redirect to success but warn
            router.push(`/order-success?id=${res.orderNumber}&payment=failed`);
        }
    } else {
        alert('Ошибка при создании заказа: ' + res.error);
        setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
                <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 space-y-8">
                    
                    {/* Contact */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Контактные данные</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" />
                            <input name="phone" type="tel" placeholder="Телефон" required className="w-full p-3 border rounded-lg" />
                            <input name="name" type="text" placeholder="Имя и Фамилия" required className="w-full p-3 border rounded-lg" />
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Данные компании (опционально)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="companyName" type="text" placeholder="Название компании" className="w-full p-3 border rounded-lg" />
                            <input name="nip" type="text" placeholder="NIP / VAT" className="w-full p-3 border rounded-lg" />
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Адрес доставки</h2>
                        <div className="space-y-4">
                            <input name="street" type="text" placeholder="Улица, дом, офис" required className="w-full p-3 border rounded-lg" />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="postalCode" type="text" placeholder="Почтовый индекс" required className="w-full p-3 border rounded-lg" />
                                <input name="city" type="text" placeholder="Город" required className="w-full p-3 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
                    <h2 className="text-xl font-bold mb-6">Ваш заказ</h2>
                    <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.title}</span>
                                <span className="font-bold">{item.price} zł</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2 font-medium">
                        <div className="flex justify-between">
                            <span>Итого (Brutto):</span>
                            <span className="text-xl text-brand-600">{(totalPrice() * 1.23).toFixed(2)} zł</span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        form="checkout-form"
                        disabled={loading}
                        className="w-full mt-6 bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        {loading ? 'Обработка...' : 'Подтвердить заказ'}
                    </button>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
