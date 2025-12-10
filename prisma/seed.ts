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

  const products: {
    category: string;
    slug: string;
    name: string;
    description: string;
  }[] = [
    // business cards
    { category: 'business-cards', slug: 'business-cards-standard', name: 'Визитки Стандарт', description: 'Классические визитки 85x55 мм на мелованной бумаге.' },
    { category: 'business-cards', slug: 'business-cards-premium', name: 'Визитки Премиум', description: 'Soft Touch покрытие и плотная бумага 450 г/м².' },
    { category: 'business-cards', slug: 'business-cards-foil', name: 'Визитки с тиснением', description: 'Фольгирование логотипа и премиальная печать.' },
    // flyers
    { category: 'flyers', slug: 'flyers-a6', name: 'Флаеры A6', description: 'Компактные флаеры для промо-кампаний.' },
    { category: 'flyers', slug: 'flyers-dl', name: 'Флаеры DL', description: 'Узкий формат DL, идеален для буклетов.' },
    { category: 'flyers', slug: 'flyers-a5', name: 'Флаеры A5', description: 'Популярный формат листовок для массовых рассылок.' },
    // posters
    { category: 'posters', slug: 'posters-a3', name: 'Постеры A3', description: 'Яркие постеры для indoor размещения.' },
    { category: 'posters', slug: 'posters-a2', name: 'Постеры A2', description: 'Крупный формат для витрин и стендов.' },
    { category: 'posters', slug: 'posters-a1', name: 'Постеры A1', description: 'Большие постеры для улицы и мероприятий.' },
    // packaging
    { category: 'packaging', slug: 'packaging-folding-box', name: 'Коробки складные', description: 'Складные коробки для e-commerce.' },
    { category: 'packaging', slug: 'packaging-product-box', name: 'Упаковка для продуктов', description: 'Коробки с печатью для розницы.' },
    { category: 'packaging', slug: 'packaging-gift', name: 'Подарочная упаковка', description: 'Плотные подарочные коробки с ламинацией.' },
    // calendars
    { category: 'calendars', slug: 'calendar-wall', name: 'Настенные календари', description: 'Календарь А3 с пружиной.' },
    { category: 'calendars', slug: 'calendar-desk', name: 'Настольные календари', description: 'Формат домик, 12 листов.' },
    { category: 'calendars', slug: 'calendar-planner', name: 'Календарь-планер', description: 'Планер на год с заметками.' },
    // stickers
    { category: 'stickers', slug: 'stickers-round', name: 'Круглые наклейки', description: 'Круглые наклейки с УФ-лаком.' },
    { category: 'stickers', slug: 'stickers-rect', name: 'Прямоугольные наклейки', description: 'Прямоугольные наклейки, матовая бумага.' },
    { category: 'stickers', slug: 'stickers-roll', name: 'Стикеры на рулонах', description: 'Этикетки на рулоне для автоматической наклейки.' },
  ];

  const baseOptionGroups = [
    {
      name: 'format',
      code: 'format',
      inputType: 'RADIO',
      sortOrder: 1,
      options: [
        { label: 'Стандарт', value: 'std', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
        { label: 'Премиум', value: 'premium', sortOrder: 2, priceFactor: new Prisma.Decimal(1.2) },
      ],
    },
    {
      name: 'paper',
      code: 'paper',
      inputType: 'SELECT',
      sortOrder: 2,
      options: [
        { label: 'Бумага 300г', value: 'paper-300', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
        { label: 'Бумага 350г', value: 'paper-350', sortOrder: 2, priceFactor: new Prisma.Decimal(1.15) },
      ],
    },
    {
      name: 'finish',
      code: 'finish',
      inputType: 'SELECT',
      sortOrder: 3,
      options: [
        { label: 'Без покрытия', value: 'none', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
        { label: 'Матовая ламинация', value: 'matte', sortOrder: 2, priceFactor: new Prisma.Decimal(1.1) },
        { label: 'Глянец', value: 'gloss', sortOrder: 3, priceFactor: new Prisma.Decimal(1.15) },
      ],
    },
    {
      name: 'timing',
      code: 'timing',
      inputType: 'RADIO',
      sortOrder: 4,
      options: [
        { label: 'Стандарт 5 дней', value: '5d', isDefault: true, sortOrder: 1, priceFactor: new Prisma.Decimal(1) },
        { label: 'Срочно 2 дня', value: '2d', sortOrder: 2, priceFactor: new Prisma.Decimal(1.3) },
      ],
    },
  ];

  const priceRowsBase = [
    { quantityFrom: 100, quantityTo: 199, unitNetPrice: '0.50' },
    { quantityFrom: 200, quantityTo: 499, unitNetPrice: '0.35' },
    { quantityFrom: 500, quantityTo: 999, unitNetPrice: '0.25' },
    { quantityFrom: 1000, quantityTo: 1999, unitNetPrice: '0.20' },
    { quantityFrom: 2000, quantityTo: null, unitNetPrice: '0.15' },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { category_slug: { category: productData.category, slug: productData.slug } },
      update: {},
      create: {
        category: productData.category,
        slug: productData.slug,
        name: productData.name,
        description: productData.description,
        isActive: true,
        optionGroups: {
          create: baseOptionGroups.map((group) => ({
            name: group.name,
            code: group.code,
            inputType: group.inputType,
            sortOrder: group.sortOrder,
            options: {
              create: group.options,
            },
          })),
        },
        priceTables: {
          create: {
            name: `${productData.name} — базовая таблица`,
            currency: 'PLN',
            rows: {
              create: priceRowsBase.map((row) => ({
                optionsCombinationHash: 'default',
                quantityFrom: row.quantityFrom,
                quantityTo: row.quantityTo,
                unitNetPrice: new Prisma.Decimal(row.unitNetPrice),
                productionDays: 5,
              })),
            },
          },
        },
      },
    });
  }

  console.log('Seed completed. Products:', products.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
