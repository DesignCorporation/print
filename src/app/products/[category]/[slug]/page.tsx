import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import { PRODUCT_DATA } from '@/lib/products';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { category: string; slug: string } }) {
  // In real app, fetch from DB by slug
  // @ts-ignore
  const product = PRODUCT_DATA[params.slug];

  if (!product) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex text-sm text-gray-500 mb-8">
                <a href="/" className="hover:text-brand-600">Главная</a>
                <span className="mx-2">/</span>
                <a href="/products" className="hover:text-brand-600">Каталог</a>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{product.title}</span>
            </nav>

            <ProductConfigurator product={product} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
