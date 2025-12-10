import { prisma } from './prisma';

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      priceTables: {
        include: {
          rows: true,
        },
      },
      optionGroups: {
        include: { options: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductsByCategory(category: string) {
  return prisma.product.findMany({
    where: { category: { equals: category, mode: 'insensitive' } },
    include: {
      priceTables: {
        include: { rows: true },
      },
      optionGroups: {
        include: { options: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductBySlug(category: string, slug: string) {
  return prisma.product.findFirst({
    where: {
      category: { equals: category, mode: 'insensitive' },
      slug,
    },
    include: {
      optionGroups: {
        include: { options: true },
        orderBy: { sortOrder: 'asc' },
      },
      priceTables: {
        include: {
          rows: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });
}
