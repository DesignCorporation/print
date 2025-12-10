import { updateOrderStatus } from '@/app/admin/actions';
import { Package, Truck, CheckCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(params.id) },
    include: { user: true, items: true, shippingAddress: true }
  });

  if (!order) return <div>Order not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Заказ #{order.orderNumber}</h1>
            <p className="text-gray-500">Создан: {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
            <form action={updateOrderStatus.bind(null, order.id, 'IN_PRODUCTION')}>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Package size={16} /> В производство
                </button>
            </form>
            <form action={updateOrderStatus.bind(null, order.id, 'SHIPPED')}>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                    <Truck size={16} /> Отправить
                </button>
            </form>
            <form action={updateOrderStatus.bind(null, order.id, 'COMPLETED')}>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                    <CheckCircle size={16} /> Завершить
                </button>
            </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-bold text-lg mb-4">Состав заказа</h2>
                <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div>
                                <div className="font-bold">{item.productNameSnapshot}</div>
                                <div className="text-sm text-gray-500">{item.options}</div>
                            </div>
                            <div className="text-right">
                                <div>{item.quantity} шт</div>
                                <div className="font-bold">{(Number(item.totalNet)).toFixed(2)} PLN</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-bold text-lg mb-4">Клиент</h2>
                <p>{order.user.name}</p>
                <p className="text-gray-500">{order.user.email}</p>
                <p className="text-gray-500">{order.user.phone}</p>
                {order.user.companyName && <p className="mt-2 font-medium">{order.user.companyName}</p>}
                {order.user.vatNumber && <p className="text-sm text-gray-500">NIP: {order.user.vatNumber}</p>}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-bold text-lg mb-4">Доставка</h2>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.postalCode}, {order.shippingAddress.city}</p>
                <p>{order.shippingAddress.country}</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="font-bold text-lg mb-4">Статус</h2>
                <div className="mb-4">
                    <span className="block text-xs text-gray-500 uppercase">Оплата</span>
                    <span className="font-bold text-green-600">{order.paymentStatus}</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-500 uppercase">Исполнение</span>
                    <span className="font-bold text-blue-600">{order.status}</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
