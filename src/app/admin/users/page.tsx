import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, lastName: true, role: true, createdAt: true },
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Клиенты</h1>
        <p className="text-gray-500">Список зарегистрированных пользователей</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-500">Пользователь</th>
              <th className="px-6 py-3 font-medium text-gray-500">Роль</th>
              <th className="px-6 py-3 font-medium text-gray-500">Создан</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {[u.name, u.lastName].filter(Boolean).join(' ') || 'Без имени'}
                  </div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{u.role}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">{u.createdAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500" colSpan={3}>
                  Пользователей пока нет
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500">
        Управление ролями/блокировками можно добавить позже. Сейчас список только для просмотра.
      </div>
    </div>
  );
}
