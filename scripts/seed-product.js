const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.upsert({
    where: { category_slug: { category: 'BUSINESS_CARD', slug: 'business-cards' } },
    update: {},
    create: {
      category: 'BUSINESS_CARD',
      slug: 'business-cards',
      name: 'Визитки Стандарт',
      description: 'Классические визитки'
    },
  });
  console.log({ product });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
