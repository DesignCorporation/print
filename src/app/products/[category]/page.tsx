import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/products-db';
import { notFound } from 'next/navigation';

const CATEGORY_LABELS: Record<string, string> = {
  'business-cards': 'Визитки',
  'flyers': 'Листовки',
  'posters': 'Плакаты',
  'packaging': 'Упаковка',
  'calendars': 'Календари',
  'stickers': 'Наклейки',
};

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const products = await getProductsByCategory(params.category);

  if (!products.length) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-600">Главная</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-brand-600">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{CATEGORY_LABELS[params.category] || params.category}</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {CATEGORY_LABELS[params.category] || params.category}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.category}/${product.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700">
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
              <div className="mt-4 text-sm font-semibold text-brand-700">Конфигурировать →</div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mt-8">
            В этой категории пока нет товаров.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
