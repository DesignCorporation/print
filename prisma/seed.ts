import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const clientPassword = await bcrypt.hash('client123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@designcorp.eu' },
    update: {
      role: 'ADMIN',
      name: 'Admin User',
      passwordHash: adminPassword,
    },
    create: {
      email: 'admin@designcorp.eu',
      name: 'Admin User',
      role: 'ADMIN',
      passwordHash: adminPassword,
    },
  });

  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: { name: 'Client Demo' },
    create: {
      email: 'client@example.com',
      name: 'Client Demo',
      role: 'CUSTOMER',
      passwordHash: clientPassword,
    },
  });

  // Product: Визитки Стандарт
  const product = await prisma.product.upsert({
    where: { category_slug: { category: 'business-cards', slug: 'business-cards-standard' } },
    update: {},
    create: {
      category: 'business-cards',
      slug: 'business-cards-standard',
      name: 'Визитки Стандарт',
      description: 'Классические односторонние визитки 85x55 мм с базовой бумагой.',
      isActive: true,
      optionGroups: {
        create: [
          {
            name: 'format',
            code: 'format',
            inputType: 'RADIO',
            sortOrder: 1,
            options: {
              create: [
                { label: '85x55 мм', value: '85x55', code: '85x55', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
                { label: '90x50 мм', value: '90x50', code: '90x50', sortOrder: 2, priceFactor: new Prisma.Decimal(1.05) },
              ],
            },
          },
          {
            name: 'paper',
            code: 'paper',
            inputType: 'SELECT',
            sortOrder: 2,
            options: {
              create: [
                { label: 'Бумага 300г матовая', value: 'paper-300', code: '300gsm', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
                { label: 'Бумага 350г мелованная', value: 'paper-350', code: '350gsm', sortOrder: 2, priceFactor: new Prisma.Decimal(1.2) },
              ],
            },
          },
          {
            name: 'finish',
            code: 'finish',
            inputType: 'SELECT',
            sortOrder: 3,
            options: {
              create: [
                { label: 'Без покрытия', value: 'no-finish', code: 'none', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
                { label: 'Глянцевая ламинация', value: 'gloss', code: 'gloss', sortOrder: 2, priceFactor: new Prisma.Decimal(1.15) },
                { label: 'Матовая ламинация', value: 'matte', code: 'matte', sortOrder: 3, priceFactor: new Prisma.Decimal(1.1) },
              ],
            },
          },
          {
            name: 'timing',
            code: 'timing',
            inputType: 'RADIO',
            sortOrder: 4,
            options: {
              create: [
                { label: 'Стандарт 5 дней', value: 'standard-5d', code: '5d', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
                { label: 'Срочно 2 дня', value: 'express-2d', code: '2d', sortOrder: 2, priceFactor: new Prisma.Decimal(1.3) },
              ],
            },
          },
        ],
      },
      priceTables: {
        create: {
          name: 'Визитки Стандарт — базовая таблица',
          currency: 'PLN',
          rows: {
            create: [
              {
                optionsCombinationHash: 'format=85x55|paper=paper-300|finish=no-finish|timing=standard-5d',
                quantityFrom: 100,
                quantityTo: 199,
                unitNetPrice: new Prisma.Decimal('0.50'),
                productionDays: 5,
              },
              {
                optionsCombinationHash: 'format=85x55|paper=paper-300|finish=no-finish|timing=standard-5d',
                quantityFrom: 200,
                quantityTo: 499,
                unitNetPrice: new Prisma.Decimal('0.35'),
                productionDays: 5,
              },
              {
                optionsCombinationHash: 'format=85x55|paper=paper-300|finish=no-finish|timing=standard-5d',
                quantityFrom: 500,
                quantityTo: 999,
                unitNetPrice: new Prisma.Decimal('0.25'),
                productionDays: 5,
              },
              {
                optionsCombinationHash: 'format=85x55|paper=paper-300|finish=no-finish|timing=standard-5d',
                quantityFrom: 1000,
                quantityTo: 1999,
                unitNetPrice: new Prisma.Decimal('0.20'),
                productionDays: 5,
              },
              {
                optionsCombinationHash: 'format=85x55|paper=paper-300|finish=no-finish|timing=standard-5d',
                quantityFrom: 2000,
                quantityTo: null,
                unitNetPrice: new Prisma.Decimal('0.15'),
                productionDays: 5,
              },
            ],
          },
        },
      },
    },
  });

  console.log('Seed completed. Product id:', product.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
