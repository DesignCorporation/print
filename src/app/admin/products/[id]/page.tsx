import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProductEditor } from '../ProductEditor';

type Params = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

export default async function AdminProductPage({ params }: Params) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!id) return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      optionGroups: {
        orderBy: { sortOrder: 'asc' },
        include: { options: { orderBy: { sortOrder: 'asc' } } },
      },
      priceTables: {
        orderBy: { createdAt: 'desc' },
        include: { rows: { orderBy: { quantityFrom: 'asc' } } },
      },
    },
  });

  if (!product) return notFound();

  return <ProductEditor product={product} />;
}
