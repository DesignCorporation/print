import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AccountSidebar } from '@/components/account/Sidebar';
import { changePassword } from '@/app/account/actions';

export default async function SecurityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar name={session.user.name} email={session.user.email} active="security" />

          <div className="flex-1 max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Безопасность</h1>

            <form action={changePassword} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <label className="flex flex-col gap-2 text-sm text-gray-700">
                Текущий пароль
                <input name="currentPassword" type="password" className="p-3 border rounded-lg" />
                <span className="text-xs text-gray-500">Если ранее пароля не было, оставьте пустым.</span>
              </label>
              <label className="flex flex-col gap-2 text-sm text-gray-700">
                Новый пароль
                <input name="newPassword" type="password" required className="p-3 border rounded-lg" />
              </label>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition"
              >
                Сменить пароль
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
