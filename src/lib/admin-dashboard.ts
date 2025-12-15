import { prisma } from './prisma';

type DailyPoint = { date: string; revenue: number; count: number };
type StatusSlice = { status: string; count: number };
type TopProduct = { productId: number | null; name: string; revenue: number; quantity: number };

export type AdminDashboardData = {
  kpi: {
    today: { revenue: number; orders: number };
    week: { revenue: number; orders: number };
    month: { revenue: number; orders: number };
  };
  daily: DailyPoint[];
  statuses: StatusSlice[];
  topProducts: TopProduct[];
  latestOrders: {
    id: number;
    orderNumber: string;
    customer: string;
    email: string;
    total: number;
    status: string;
    paymentStatus: string | null;
    createdAt: string;
    createdAtLabel: string;
  }[];
};

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const now = new Date();
  const startToday = startOfDay(now);
  const startWeek = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)); // last 7 days incl today
  const startMonth = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));

  const [aggToday, aggWeek, aggMonth] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalGross: true },
      _count: true,
      where: { status: 'PAID', createdAt: { gte: startToday } },
    }),
    prisma.order.aggregate({
      _sum: { totalGross: true },
      _count: true,
      where: { status: 'PAID', createdAt: { gte: startWeek } },
    }),
    prisma.order.aggregate({
      _sum: { totalGross: true },
      _count: true,
      where: { status: 'PAID', createdAt: { gte: startMonth } },
    }),
  ]);

  const chartFrom = startOfDay(new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000)); // 14 days
  const dailyRaw = await prisma.$queryRaw<
    { date: Date; revenue: string | number | null; count: number }[]
  >`SELECT date("createdAt") AS date, SUM("totalGross") AS revenue, COUNT(*) AS count
    FROM "Order"
    WHERE "status" = 'PAID' AND "createdAt" >= ${chartFrom}
    GROUP BY date("createdAt")
    ORDER BY date("createdAt") ASC`;

  const dailyMap = new Map<string, DailyPoint>();
  for (const row of dailyRaw) {
    const key = row.date.toISOString().slice(0, 10);
    dailyMap.set(key, {
      date: key,
      revenue: Number(row.revenue || 0),
      count: Number(row.count || 0),
    });
  }

  const daily: DailyPoint[] = [];
  for (let i = 0; i < 14; i++) {
    const day = new Date(chartFrom.getTime() + i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    daily.push(dailyMap.get(key) || { date: key, revenue: 0, count: 0 });
  }

  const statusesRaw = await prisma.order.groupBy({
    by: ['status'],
    _count: { _all: true },
  });
  const statuses: StatusSlice[] = statusesRaw.map((s) => ({
    status: s.status,
    count: s._count._all,
  }));

  const topProductsRaw = await prisma.$queryRaw<
    { productId: number | null; name: string | null; revenue: string; quantity: number }[]
  >`SELECT oi."productId" AS "productId",
           COALESCE(oi."productNameSnapshot", p."name") AS name,
           SUM(oi."totalNet") AS revenue,
           SUM(oi."quantity") AS quantity
    FROM "OrderItem" oi
    JOIN "Order" o ON o."id" = oi."orderId"
    LEFT JOIN "Product" p ON p."id" = oi."productId"
    WHERE o."status" = 'PAID'
    GROUP BY oi."productId", oi."productNameSnapshot", p."name"
    ORDER BY SUM(oi."totalNet") DESC
    LIMIT 5`;

  const topProducts: TopProduct[] = topProductsRaw.map((p) => ({
    productId: p.productId,
    name: p.name || 'Без названия',
    revenue: Number(p.revenue || 0),
    quantity: Number(p.quantity || 0),
  }));

  const latestOrdersRaw = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  const latestOrders = latestOrdersRaw.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: [o.user.name, o.user.lastName].filter(Boolean).join(' ') || o.user.email,
    email: o.user.email,
    total: Number(o.totalGross || 0),
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    createdAtLabel: o.createdAt.toLocaleString('ru-RU', { timeZone: 'UTC' }),
  }));

  return {
    kpi: {
      today: { revenue: Number(aggToday._sum.totalGross || 0), orders: aggToday._count },
      week: { revenue: Number(aggWeek._sum.totalGross || 0), orders: aggWeek._count },
      month: { revenue: Number(aggMonth._sum.totalGross || 0), orders: aggMonth._count },
    },
    daily,
    statuses,
    topProducts,
    latestOrders,
  };
}
