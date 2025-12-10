import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountSidebar } from '@/components/account/Sidebar';
import { updateProfile } from '@/app/account/actions';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar name={user?.name} email={user?.email} active="profile" />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль</h1>

            <form action={updateProfile} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Имя
                  <input name="name" defaultValue={user?.name || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Фамилия
                  <input name="lastName" defaultValue={user?.lastName || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Телефон
                  <input name="phone" defaultValue={user?.phone || ''} className="p-3 border rounded-lg" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Компания
                  <input name="companyName" defaultValue={user?.companyName || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Улица, дом, офис
                  <input name="companyStreet" defaultValue={user?.companyStreet || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Город
                  <input name="companyCity" defaultValue={user?.companyCity || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Индекс
                  <input name="companyPostalCode" defaultValue={user?.companyPostalCode || ''} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  Страна
                  <input name="companyCountry" defaultValue={user?.companyCountry || 'Poland'} className="p-3 border rounded-lg" />
                </label>
                <label className="flex flex-col gap-2 text-sm text-gray-700">
                  NIP / VAT
                  <input name="vatNumber" defaultValue={user?.vatNumber || ''} className="p-3 border rounded-lg" />
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition"
              >
                Сохранить
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
