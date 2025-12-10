import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductConfigurator from '@/components/product/ProductConfigurator';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products-db';
import type { Prisma } from '@prisma/client';

type ConfigOptionValue = { id: string; name: string; priceMod?: number; price?: number };
type ConfigOptionGroup = { id: string; name: string; type: string; values: ConfigOptionValue[] };
type ConfigProduct = { title: string; description: string; basePrice: number; options: ConfigOptionGroup[] };

function mapProductToConfigurator(product: Prisma.ProductGetPayload<{
  include: { optionGroups: { include: { options: true } }; priceTables: { include: { rows: true } } };
}>): ConfigProduct {
  const firstTable = product.priceTables[0];
  const quantityValues: ConfigOptionValue[] =
    firstTable?.rows
      .sort((a, b) => a.quantityFrom - b.quantityFrom)
      .map((row) => ({
        id: String(row.quantityFrom),
        name: `${row.quantityFrom}${row.quantityTo ? `–${row.quantityTo}` : '+'} шт`,
        price: Number(row.unitNetPrice),
      })) ?? [];

  const optionGroups: ConfigOptionGroup[] = product.optionGroups.map((group) => ({
    id: group.code || group.name,
    name: group.name,
    type: group.inputType.toLowerCase(),
    values: group.options
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((opt) => ({
        id: opt.value,
        name: opt.label,
        priceMod: opt.priceFactor ? Number(opt.priceFactor) : undefined,
      })),
  }));

  if (quantityValues.length > 0) {
    optionGroups.push({
      id: 'quantity',
      name: 'Тираж',
      type: 'grid',
      values: quantityValues,
    });
  }

  const basePrice = quantityValues[0]?.price ?? 0;

  return {
    title: product.name,
    description: product.description ?? '',
    basePrice,
    options: optionGroups,
  };
}

export default async function ProductPage({ params }: { params: { category: string; slug: string } }) {
  const product = await getProductBySlug(params.category, params.slug);

  if (!product) {
    return notFound();
  }

  const mapped = mapProductToConfigurator(product);

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
                <span className="text-gray-900">{product.name}</span>
            </nav>

            <ProductConfigurator product={mapped} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
