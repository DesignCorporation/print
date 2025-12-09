import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Package, FileText, User } from 'lucide-react';

const prisma = new PrismaClient();

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) return null; // Middleware handles redirect

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
        orders: {
            orderBy: { createdAt: 'desc' },
            take: 5
        }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white p-6 rounded-xl border border-gray-200 h-fit">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>
                
                <nav className="space-y-2">
                    <Link href="/account" className="flex items-center gap-3 px-4 py-2 bg-brand-50 text-brand-700 rounded-lg font-medium">
                        <Package size={18} />
                        Мои заказы
                    </Link>
                    <Link href="/account/profile" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <User size={18} />
                        Профиль
                    </Link>
                    <Link href="/account/invoices" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <FileText size={18} />
                        Фактуры
                    </Link>
                </nav>
            </aside>

            {/* Content */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Последние заказы</h1>
                
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Номер</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Дата</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Сумма</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Статус</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {user?.orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold">
                                        {(Number(order.totalGross)).toFixed(2)} PLN
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                            order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                            order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/account/orders/${order.id}`} className="text-brand-600 hover:text-brand-800">
                                            Детали
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {user?.orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        У вас пока нет заказов.
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
