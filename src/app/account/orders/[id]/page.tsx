import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { RepeatOrderButton } from './repeat-order-button';

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const order = await prisma.order.findFirst({
    where: { id: parseInt(id), user: { email: session.user.email } },
    include: {
      items: { include: { files: true, product: true } },
      shippingAddress: true,
    },
  });

  if (!order) return notFound();

  const serializableItems = order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    title: item.productNameSnapshot,
    quantity: item.quantity,
    unitNetPrice: Number(item.unitNetPrice),
    totalNet: Number(item.totalNet),
    options: item.options,
    files: item.files.map((f) => ({
      key: f.id.toString(),
      url: f.url,
      name: f.originalName,
      size: f.size,
      type: f.mimeType,
    })),
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Заказ {order.orderNumber}</h1>
            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <RepeatOrderButton items={serializableItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{item.productNameSnapshot}</div>
                    <div className="text-sm text-gray-600">Количество: {item.quantity}</div>
                    <div className="text-sm text-gray-600">Опции: {item.options}</div>
                    {item.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="text-xs text-gray-600">Файлы:</div>
                        {item.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-600 hover:underline block"
                          >
                            {file.originalName} ({(file.size / 1024).toFixed(1)} KB)
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right font-bold text-brand-900">{Number(item.totalNet).toFixed(2)} PLN</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <h3 className="font-semibold text-gray-900">Доставка</h3>
            <div className="text-sm text-gray-700">
              <div>{order.shippingAddress.fullName}</div>
              {order.shippingAddress.companyName && <div>{order.shippingAddress.companyName}</div>}
              <div>{order.shippingAddress.street}</div>
              <div>
                {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.country}
              </div>
            </div>
            <div className="pt-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Сумма (Netto)</span>
                <span>{Number(order.totalNet).toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between">
                <span>VAT</span>
                <span>{Number(order.totalVat).toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900">
                <span>Итого</span>
                <span>{Number(order.totalGross).toFixed(2)} PLN</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
