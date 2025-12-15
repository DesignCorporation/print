import { createProductAction } from '../actions';

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Новый товар</h1>
      <p className="text-gray-500 mb-6">Заполните основные данные. Остальные настройки доступны после сохранения.</p>

      <form action={createProductAction} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Категория
            <input
              name="category"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Slug
            <input
              name="slug"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Название
          <input
            name="name"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Описание
          <textarea
            name="description"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" name="isActive" defaultChecked className="rounded border-gray-300 text-brand-600" />
          Активен
        </label>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            Сохранить и перейти к настройкам
          </button>
        </div>
      </form>
    </div>
  );
}
