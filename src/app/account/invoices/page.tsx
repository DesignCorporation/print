import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountSidebar } from '@/components/account/Sidebar';
import Link from 'next/link';

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  const invoices = await prisma.invoice.findMany({
    where: { order: { user: { email: session.user.email } } },
    include: { order: true, file: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar name={user?.name} lastName={user?.lastName} email={user?.email} active="invoices" />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Фактуры</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500">Номер</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Заказ</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Сумма</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Статус</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                      <td className="px-6 py-4 text-brand-600">
                        <Link href={`/account/orders/${inv.orderId}`}>{inv.order.orderNumber}</Link>
                      </td>
                      <td className="px-6 py-4 font-bold">{Number(inv.totalGross).toFixed(2)} PLN</td>
                      <td className="px-6 py-4">{inv.status}</td>
                      <td className="px-6 py-4">
                        {inv.file ? (
                          <a href={inv.file.url} className="text-brand-600 hover:underline" target="_blank" rel="noreferrer">
                            Скачать
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">Файл недоступен</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Фактур пока нет.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
