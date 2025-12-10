import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Все заказы</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-4 font-medium text-gray-500">Заказ</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Клиент</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Сумма</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Статус</th>
                    <th className="px-6 py-4 font-medium text-gray-500">Оплата</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold">{order.orderNumber}</td>
                        <td className="px-6 py-4">
                            <div>{order.user.name}</div>
                            <div className="text-xs text-gray-500">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 font-bold">{(Number(order.totalGross)).toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                order.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                order.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {order.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{order.paymentStatus}</td>
                        <td className="px-6 py-4 text-right">
                            <Link href={`/admin/orders/${order.id}`} className="text-brand-600 hover:underline">
                                Управление
                            </Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
