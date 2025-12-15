/* eslint-disable @next/next/no-async-client-component */
'use client';

import { useCartStore } from '@/lib/store';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect, useMemo, useState } from 'react';
import { createOrder, createStripeSession } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Address = {
  id: number;
  fullName: string;
  companyName?: string | null;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  phone?: string | null;
};

type Profile = {
  email: string;
  name?: string | null;
  lastName?: string | null;
  phone?: string | null;
  companyName?: string | null;
  vatNumber?: string | null;
};

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [mode, setMode] = useState<'saved' | 'new'>('new');
  const [prefill, setPrefill] = useState<Profile | null>(null);
  const [saveAddress, setSaveAddress] = useState(true);
  const session = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetch('/api/account/addresses')
        .then((res) => res.json())
        .then((data) => {
          setAddresses(data.addresses || []);
          if (data.addresses?.length) {
            const def = data.addresses.find((a: Address) => a.isDefault) || data.addresses[0];
            setSelectedAddressId(def.id);
            setMode('saved');
          } else {
            setMode('new');
          }
          if (data.user) {
            setPrefill(data.user);
          }
        })
        .catch(() => {});
    }
  }, [session.status]);

  const defaultName = useMemo(() => {
    if (!prefill) return '';
    return prefill.name || '';
  }, [prefill]);

  const defaultLastName = useMemo(() => {
    if (!prefill) return '';
    return prefill.lastName || '';
  }, [prefill]);

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
    const data: any = {
      email: formData.get('email') as string,
      name: formData.get('name') as string,
      lastName: (formData.get('lastName') as string) || '',
      companyName: (formData.get('companyName') as string) || '',
      nip: (formData.get('nip') as string) || '',
      phone: formData.get('phone') as string,
      cartItems: items,
      totalPrice: totalPrice(),
    };

    if (mode === 'saved' && selectedAddressId) {
      data.addressId = selectedAddressId;
    } else {
      data.street = formData.get('street') as string;
      data.city = formData.get('city') as string;
      data.postalCode = formData.get('postalCode') as string;
      data.addressPhone = (formData.get('addressPhone') as string) || '';
      data.saveAddress = saveAddress && session.status === 'authenticated';
    }

    const res = await createOrder(data);

    if (res.success && res.orderId) {
      const stripeRes = await createStripeSession(res.orderId);

      if (stripeRes.success && stripeRes.url) {
        // Не очищаем корзину до успешной оплаты, чтобы Back из Stripe не пустил корзину
        window.location.href = stripeRes.url;
      } else {
        const message = !stripeRes.success && 'error' in stripeRes ? stripeRes.error : 'unknown';
        alert('Ошибка создания платежа: ' + message);
        router.push(`/order-success?id=${res.orderNumber}&payment=failed`);
      }
    } else {
      const message = !res.success && 'error' in res ? res.error : 'unknown';
      alert('Ошибка при создании заказа: ' + message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Оформление заказа</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-gray-200 space-y-8">
              <div>
                <h2 className="text-xl font-bold mb-4">Контактные данные</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="email" type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" defaultValue={prefill?.email || ''} />
                  <input name="phone" type="tel" placeholder="Телефон" required className="w-full p-3 border rounded-lg" defaultValue={prefill?.phone || ''} />
                  <input name="name" type="text" placeholder="Имя" required className="w-full p-3 border rounded-lg" defaultValue={defaultName} />
                  <input name="lastName" type="text" placeholder="Фамилия" className="w-full p-3 border rounded-lg" defaultValue={defaultLastName} />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Данные компании (опционально)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="companyName" type="text" placeholder="Название компании" className="w-full p-3 border rounded-lg" defaultValue={prefill?.companyName || ''} />
                  <input name="nip" type="text" placeholder="NIP / VAT" className="w-full p-3 border rounded-lg" defaultValue={prefill?.vatNumber || ''} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Адрес доставки</h2>
                  {addresses.length > 0 && (
                    <div className="flex gap-3 text-sm">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressMode"
                          checked={mode === 'saved'}
                          onChange={() => setMode('saved')}
                        />
                        Сохранённый
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressMode"
                          checked={mode === 'new'}
                          onChange={() => setMode('new')}
                        />
                        Новый адрес
                      </label>
                    </div>
                  )}
                </div>

                {mode === 'saved' && addresses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {addresses.map((addr) => (
                      <label key={addr.id} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="savedAddress"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                        />
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">{addr.fullName}</div>
                            {addr.companyName && <div className="text-gray-700">{addr.companyName}</div>}
                            <div className="text-gray-700">{addr.street}</div>
                            <div className="text-gray-700">
                              {addr.postalCode}, {addr.city}, {addr.country}
                            </div>
                            {addr.phone && <div className="text-gray-700">Тел: {addr.phone}</div>}
                            {addr.isDefault && <div className="text-xs text-green-600 mt-1">По умолчанию</div>}
                          </div>
                        </label>
                    ))}
                  </div>
                )}

                {mode === 'new' && (
                  <div className="space-y-4">
                    <input name="street" type="text" placeholder="Улица, дом, офис" required className="w-full p-3 border rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                      <input name="postalCode" type="text" placeholder="Почтовый индекс" required className="w-full p-3 border rounded-lg" />
                      <input name="city" type="text" placeholder="Город" required className="w-full p-3 border rounded-lg" />
                    </div>
                    <input
                      name="addressPhone"
                      type="tel"
                      placeholder="Телефон для доставки"
                      className="w-full p-3 border rounded-lg"
                      defaultValue={prefill?.phone || ''}
                    />
                    {session.status === 'authenticated' && (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
                        Сохранить этот адрес в профиле
                      </label>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Ваш заказ</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const qtyOpt = item.options?.quantity ? parseInt(item.options.quantity, 10) : item.quantity;
                  return (
                  <div key={item.id} className="text-sm space-y-1 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">{item.title}</span>
                      <span className="font-bold">{(item.price * item.quantity).toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>шт: {qtyOpt}</span>
                      <span>сумма нетто: {(item.price * item.quantity).toFixed(2)} zł</span>
                    </div>
                    {item.files && item.files.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600">Файлы:</div>
                        {item.files.map((file) => (
                          <a
                            key={file.key}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-600 hover:underline"
                          >
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );})}
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
