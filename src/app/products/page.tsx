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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Каталог продукции</h1>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {CATEGORY_LABELS[category] || category}
                </h2>
                <span className="text-sm text-gray-500">{items.length} позиций</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.category}/${product.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-700">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>Категория: {CATEGORY_LABELS[product.category] || product.category}</span>
                      <span className="font-semibold text-brand-700">Перейти →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {products.length === 0 && (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
              Пока нет доступных продуктов. Добавьте товары через сид или админ-панель.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
