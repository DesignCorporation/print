import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountSidebar } from '@/components/account/Sidebar';
import { addAddress, deleteAddress, updateAddress, setDefaultAddress } from '@/app/account/actions';

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      addresses: { orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }] },
    },
  });

  const orderAddresses = await prisma.order.findMany({
    where: { userId: user?.id },
    select: { billingAddressId: true, shippingAddressId: true },
  });

  const usedAddressIds = new Set<number>();
  orderAddresses.forEach((o) => {
    if (o.billingAddressId) usedAddressIds.add(o.billingAddressId);
    if (o.shippingAddressId) usedAddressIds.add(o.shippingAddressId);
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar name={user?.name} lastName={user?.lastName} email={user?.email} active="addresses" />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Адреса доставки</h1>

            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900">Добавить адрес</h3>
              <form action={addAddress} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Имя
                    <input name="firstName" required className="p-3 border rounded-lg" />
                  </label>
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Фамилия
                    <input name="lastName" className="p-3 border rounded-lg" />
                  </label>
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Телефон
                    <input name="phone" className="p-3 border rounded-lg" placeholder="+48 ..." />
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Компания (опционально)
                    <input name="companyName" className="p-3 border rounded-lg" />
                  </label>
                </div>
                <label className="flex flex-col text-sm text-gray-700 gap-2">
                  Улица, дом, офис
                  <input name="street" required className="p-3 border rounded-lg" />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Город
                    <input name="city" required className="p-3 border rounded-lg" />
                  </label>
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Почтовый индекс
                    <input name="postalCode" required className="p-3 border rounded-lg" />
                  </label>
                  <label className="flex flex-col text-sm text-gray-700 gap-2">
                    Страна
                    <input name="country" defaultValue="Poland" className="p-3 border rounded-lg" />
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition"
                >
                  Сохранить адрес
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.addresses.map((addr) => {
                const used = usedAddressIds.has(addr.id);
                return (
                  <div key={addr.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{addr.fullName}</div>
                      {addr.isDefault && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">По умолчанию</span>
                      )}
                    </div>
                    {addr.companyName && <div className="text-sm text-gray-600">{addr.companyName}</div>}
                    <div className="text-sm text-gray-700">{addr.street}</div>
                    <div className="text-sm text-gray-700">
                      {addr.postalCode}, {addr.city}, {addr.country}
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      {!addr.isDefault && (
                        <form action={async () => { 'use server'; await setDefaultAddress(addr.id); }}>
                          <button type="submit" className="text-xs text-brand-600 hover:text-brand-800">
                            Сделать по умолчанию
                          </button>
                        </form>
                      )}
                      <form action={async () => { 'use server'; await deleteAddress(addr.id); }}>
                        <button
                          type="submit"
                          disabled={used}
                          className="text-xs text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:hover:text-gray-400"
                        >
                          {used ? 'Используется в заказе' : 'Удалить'}
                        </button>
                      </form>
                    </div>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-brand-600">Редактировать</summary>
                      <form action={updateAddress} className="mt-3 space-y-2">
                        <input type="hidden" name="id" value={addr.id} />
                        <input type="hidden" name="type" value={addr.type} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input name="firstName" defaultValue={addr.fullName?.split(' ')?.[0] || ''} placeholder="Имя" className="p-3 border rounded-lg" required />
                          <input name="lastName" defaultValue={addr.fullName?.split(' ')?.slice(1).join(' ') || ''} placeholder="Фамилия" className="p-3 border rounded-lg" />
                          <input name="phone" defaultValue={addr.phone || ''} placeholder="Телефон" className="p-3 border rounded-lg" />
                        </div>
                        <input name="companyName" defaultValue={addr.companyName || ''} placeholder="Компания" className="p-3 border rounded-lg" />
                        <input name="street" defaultValue={addr.street} placeholder="Улица, дом, офис" className="w-full p-3 border rounded-lg" required />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <input name="city" defaultValue={addr.city} placeholder="Город" className="p-3 border rounded-lg" required />
                          <input name="postalCode" defaultValue={addr.postalCode} placeholder="Индекс" className="p-3 border rounded-lg" required />
                          <input name="country" defaultValue={addr.country} placeholder="Страна" className="p-3 border rounded-lg" required />
                        </div>
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                          Сохранить
                        </button>
                      </form>
                    </details>
                  </div>
                );
              })}
              {user?.addresses.length === 0 && (
                <div className="text-sm text-gray-500">Адресов пока нет.</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
