import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ searchParams }: Props) {
  const search = (await searchParams) || {};
  const q = typeof search.q === 'string' ? search.q.trim() : '';
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { slug: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { category: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : {};

  const products = await prisma.product.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { optionGroups: true, priceTables: true } },
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-500">Управление каталогом</p>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
        >
          Новый товар
        </Link>
      </div>

      <form className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Поиск по названию, slug, категории"
          className="w-full md:w-96 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Искать
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Название</th>
              <th className="px-6 py-3 font-medium text-gray-500">Категория / Slug</th>
              <th className="px-6 py-3 font-medium text-gray-500">Активен</th>
              <th className="px-6 py-3 font-medium text-gray-500">Опции</th>
              <th className="px-6 py-3 font-medium text-gray-500">Цены</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-500">#{p.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{p.category}</div>
                  <div className="text-xs text-gray-500">{p.slug}</div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.isActive ? 'Да' : 'Нет'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">{p._count.optionGroups}</td>
                <td className="px-6 py-4 text-gray-700">{p._count.priceTables}</td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-brand-600 hover:underline">
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={6}>
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
