import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllProducts } from '@/lib/products-db';
import Link from 'next/link';

const CATEGORY_LABELS: Record<string, string> = {
  'business-cards': 'Визитки',
  'flyers': 'Листовки',
  'posters': 'Плакаты',
  'packaging': 'Упаковка',
  'calendars': 'Календари',
  'stickers': 'Наклейки',
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  const grouped = products.reduce<Record<string, typeof products>>((acc, product) => {
    acc[product.category] = acc[product.category] || [];
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-600">Главная</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Каталог</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Категории продукции</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, items]) => (
            <Link
              key={category}
              href={`/products/${category}`}
              className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-brand-700">
                    {CATEGORY_LABELS[category] || category}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    {items.length} {items.length === 1 ? 'товар' : 'товара'}
                  </p>
                </div>
                <span className="text-sm font-semibold text-brand-700">Перейти →</span>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 mt-8">
            Пока нет доступных продуктов. Добавьте товары через сид или админ-панель.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
