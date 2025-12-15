'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AdminDashboardData } from '@/lib/admin-dashboard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import Link from 'next/link';

const STATUS_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

type Props = { initialData: AdminDashboardData };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2 }).format(
    value || 0,
  );

export default function DashboardClient({ initialData }: Props) {
  const [data, setData] = useState<AdminDashboardData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        if (!res.ok) throw new Error(await res.text());
        const json: AdminDashboardData = await res.json();
        if (active) {
          setData(json);
          setError(null);
        }
      } catch (e: any) {
        if (active) setError('Не удалось обновить данные');
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    const id = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const statusChartData = useMemo(
    () =>
      data.statuses.map((s, idx) => ({
        name: s.status,
        value: s.count,
        fill: STATUS_COLORS[idx % STATUS_COLORS.length],
      })),
    [data.statuses],
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-500">Ключевые метрики и динамика заказов</p>
        </div>
        {loading && <span className="text-xs text-gray-400">обновление...</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Сегодня" subtitle={`${data.kpi.today.orders} заказов`} value={formatCurrency(data.kpi.today.revenue)} />
        <KpiCard title="Неделя" subtitle={`${data.kpi.week.orders} заказов`} value={formatCurrency(data.kpi.week.revenue)} />
        <KpiCard title="Месяц" subtitle={`${data.kpi.month.orders} заказов`} value={formatCurrency(data.kpi.month.revenue)} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Динамика заказов (14 дней)</h2>
              <p className="text-xs text-gray-500">Оплаченные заказы по дням</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any, name) => (name === 'revenue' ? formatCurrency(Number(v)) : v)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Заказы"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Выручка"
                  stroke="#10b981"
                  strokeWidth={2}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Статусы заказов</h2>
              <p className="text-xs text-gray-500">Распределение по статусам</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Топ 5 продуктов</h2>
              <p className="text-xs text-gray-500">По выручке (Net)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: any, name) => (name === 'revenue' ? formatCurrency(Number(v)) : v)} />
                <Bar dataKey="revenue" name="Выручка" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Последние заказы</h2>
              <p className="text-xs text-gray-500">Последние 10 записей</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {data.latestOrders.map((order) => (
              <div key={order.id} className="py-3 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{order.orderNumber}</div>
                  <div className="text-xs text-gray-500">
                    {order.customer} · {order.createdAtLabel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</div>
                  <div className="text-xs text-gray-500">{order.status} / {order.paymentStatus}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-3 text-right">
            <Link href="/admin/orders" className="text-sm text-brand-600 hover:underline">
              Все заказы →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpiCard({ title, subtitle, value }: { title: string; subtitle: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-900 mt-1">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
    </div>
  );
}
