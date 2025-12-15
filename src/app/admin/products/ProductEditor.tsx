import Link from 'next/link';
import {
  addOptionAction,
  addOptionGroupAction,
  addPriceRowAction,
  addPriceTableAction,
  deleteOptionAction,
  deleteOptionGroupAction,
  deletePriceRowAction,
  deletePriceTableAction,
  deleteProductAction,
  updateOptionAction,
  updateOptionGroupAction,
  updatePriceRowAction,
  updatePriceTableAction,
  updateProductAction,
} from './actions';
import { Product, ProductOption, ProductOptionGroup, PriceRow, PriceTable } from '@prisma/client';

type ProductFull = Product & {
  optionGroups: (ProductOptionGroup & { options: ProductOption[] })[];
  priceTables: (PriceTable & { rows: PriceRow[] })[];
};

export function ProductEditor({ product }: { product: ProductFull }) {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товар: {product.name}</h1>
          <p className="text-gray-500">
            Категория: {product.category} · Slug: {product.slug}
          </p>
        </div>
        <Link href="/admin/products" className="text-sm text-brand-600 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Основное</h2>
        <form action={updateProductAction} className="space-y-4">
          <input type="hidden" name="id" value={product.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Категория
              <input
                name="category"
                defaultValue={product.category}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Slug
              <input
                name="slug"
                defaultValue={product.slug}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm font-medium text-gray-700">
            Название
            <input
              name="name"
              defaultValue={product.name}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Описание
            <textarea
              name="description"
              defaultValue={product.description || ''}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" name="isActive" defaultChecked={product.isActive} className="rounded" />
            Активен
          </label>
          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Группы опций</h2>
          <details className="text-sm">
            <summary className="cursor-pointer text-brand-600">Добавить группу</summary>
            <form action={addOptionGroupAction} className="mt-3 space-y-2">
              <input type="hidden" name="productId" value={product.id} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input name="name" placeholder="Название" required className="rounded-lg border px-3 py-2" />
                <input name="code" placeholder="Код" className="rounded-lg border px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input name="inputType" placeholder="Тип (select/radio/...)" className="rounded-lg border px-3 py-2" />
                <input
                  name="sortOrder"
                  placeholder="Порядок"
                  type="number"
                  className="rounded-lg border px-3 py-2"
                />
              </div>
              <button type="submit" className="px-3 py-2 rounded-lg bg-brand-600 text-white">
                Добавить
              </button>
            </form>
          </details>
        </div>

        <div className="space-y-4">
          {product.optionGroups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <form action={updateOptionGroupAction} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <input type="hidden" name="id" value={group.id} />
                <input type="hidden" name="productId" value={product.id} />
                <label className="text-sm text-gray-700">
                  Название
                  <input
                    name="name"
                    defaultValue={group.name}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Код
                  <input name="code" defaultValue={group.code} className="mt-1 w-full rounded-lg border px-3 py-2" />
                </label>
                <label className="text-sm text-gray-700">
                  Тип
                  <input
                    name="inputType"
                    defaultValue={group.inputType}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Порядок
                  <input
                    name="sortOrder"
                    type="number"
                    defaultValue={group.sortOrder}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </label>
                <div className="md:col-span-4 flex gap-2">
                  <button type="submit" className="px-3 py-2 rounded-lg bg-gray-800 text-white">
                    Сохранить группу
                  </button>
                  <button
                    type="submit"
                    formAction={deleteOptionGroupAction}
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600"
                  >
                    Удалить
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {group.options.map((opt) => (
                  <form
                    key={opt.id}
                    action={updateOptionAction}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end border border-gray-100 rounded-lg p-3"
                  >
                    <input type="hidden" name="id" value={opt.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <label className="text-sm text-gray-700">
                      Название
                      <input
                        name="label"
                        defaultValue={opt.label}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        required
                      />
                    </label>
                    <label className="text-sm text-gray-700">
                      Значение
                      <input
                        name="value"
                        defaultValue={opt.value}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        required
                      />
                    </label>
                    <label className="text-sm text-gray-700">
                      Код
                      <input name="code" defaultValue={opt.code || ''} className="mt-1 w-full rounded-lg border px-3 py-2" />
                    </label>
                    <label className="text-sm text-gray-700">
                      Фактор цены
                      <input
                        name="priceFactor"
                        type="number"
                        step="0.01"
                        defaultValue={opt.priceFactor ? opt.priceFactor.toString() : ''}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </label>
                    <label className="text-sm text-gray-700">
                      Порядок
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={opt.sortOrder}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                      />
                    </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
                  <input type="checkbox" name="isDefault" defaultChecked={opt.isDefault} className="rounded" />
                  По умолчанию
                </label>
                <div className="flex gap-2 md:col-span-6">
                  <button type="submit" className="px-3 py-2 rounded-lg bg-gray-800 text-white">
                    Сохранить опцию
                  </button>
                  <button
                    type="submit"
                    formAction={deleteOptionAction}
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600"
                  >
                    Удалить
                  </button>
                </div>
              </form>
            ))}

                <details className="text-sm">
                  <summary className="cursor-pointer text-brand-600">Добавить опцию</summary>
                  <form action={addOptionAction} className="mt-2 grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <input type="hidden" name="groupId" value={group.id} />
                    <input type="hidden" name="productId" value={product.id} />
                    <input name="label" placeholder="Название" required className="rounded-lg border px-3 py-2" />
                    <input name="value" placeholder="Значение" required className="rounded-lg border px-3 py-2" />
                    <input name="priceFactor" type="number" step="0.01" placeholder="Фактор" className="rounded-lg border px-3 py-2" />
                    <input name="sortOrder" type="number" placeholder="Порядок" className="rounded-lg border px-3 py-2" />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" name="isDefault" className="rounded" />
                      По умолчанию
                    </label>
                    <button type="submit" className="px-3 py-2 rounded-lg bg-brand-600 text-white md:col-span-5">
                      Добавить
                    </button>
                  </form>
                </details>
              </div>
            </div>
          ))}
          {product.optionGroups.length === 0 && <p className="text-sm text-gray-500">Групп опций пока нет.</p>}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Прайс-таблицы</h2>
          <details className="text-sm">
            <summary className="cursor-pointer text-brand-600">Добавить таблицу</summary>
            <form action={addPriceTableAction} className="mt-3 flex flex-col md:flex-row gap-2">
              <input type="hidden" name="productId" value={product.id} />
              <input name="name" placeholder="Название" required className="rounded-lg border px-3 py-2" />
              <input name="currency" placeholder="Валюта" defaultValue="PLN" className="rounded-lg border px-3 py-2" />
              <button type="submit" className="px-3 py-2 rounded-lg bg-brand-600 text-white">
                Добавить
              </button>
            </form>
          </details>
        </div>

        <div className="space-y-4">
          {product.priceTables.map((table) => (
            <div key={table.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <form action={updatePriceTableAction} className="flex flex-col md:flex-row gap-2 items-end">
                <input type="hidden" name="id" value={table.id} />
                <input type="hidden" name="productId" value={product.id} />
                <label className="text-sm text-gray-700 w-full">
                  Название
                  <input
                    name="name"
                    defaultValue={table.name}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </label>
                <label className="text-sm text-gray-700 w-full md:w-32">
                  Валюта
                  <input
                    name="currency"
                    defaultValue={table.currency}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                    required
                  />
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-2 rounded-lg bg-gray-800 text-white">
                    Сохранить
                  </button>
                  <button
                    type="submit"
                    formAction={deletePriceTableAction}
                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600"
                  >
                    Удалить таблицу
                  </button>
                </div>
              </form>
            </div>

              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-500">Хеш опций</th>
                      <th className="px-3 py-2 text-left text-gray-500">От</th>
                      <th className="px-3 py-2 text-left text-gray-500">До</th>
                      <th className="px-3 py-2 text-left text-gray-500">Цена (нетто)</th>
                      <th className="px-3 py-2 text-left text-gray-500">Дни</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {table.rows.map((row) => (
                      <tr key={row.id}>
                        <td colSpan={6}>
                          <form action={updatePriceRowAction} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end p-2">
                            <input type="hidden" name="id" value={row.id} />
                            <input type="hidden" name="productId" value={product.id} />
                            <label className="text-sm text-gray-700">
                              Комбинация
                              <input
                                name="optionsCombinationHash"
                                defaultValue={row.optionsCombinationHash}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                                required
                              />
                            </label>
                            <label className="text-sm text-gray-700">
                              От
                              <input
                                name="quantityFrom"
                                type="number"
                                defaultValue={row.quantityFrom}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                                required
                              />
                            </label>
                            <label className="text-sm text-gray-700">
                              До
                              <input
                                name="quantityTo"
                                type="number"
                                defaultValue={row.quantityTo ?? ''}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                              />
                            </label>
                            <label className="text-sm text-gray-700">
                              Цена
                              <input
                                name="unitNetPrice"
                                type="number"
                                step="0.01"
                                defaultValue={row.unitNetPrice.toString()}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                                required
                              />
                            </label>
                            <label className="text-sm text-gray-700">
                              Дни
                              <input
                                name="productionDays"
                                type="number"
                                defaultValue={row.productionDays}
                                className="mt-1 w-full rounded-lg border px-3 py-2"
                                required
                              />
                            </label>
                            <div className="flex gap-2 md:col-span-6">
                              <button type="submit" className="px-3 py-2 rounded-lg bg-gray-800 text-white">
                                Сохранить
                              </button>
                              <button
                                type="submit"
                                formAction={deletePriceRowAction}
                                className="px-3 py-2 rounded-lg border border-red-300 text-red-600"
                              >
                                Удалить
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {table.rows.length === 0 && (
                      <tr>
                        <td className="px-3 py-3 text-gray-500" colSpan={6}>
                          Строк нет
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer text-brand-600">Добавить строку</summary>
                <form action={addPriceRowAction} className="mt-2 grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                  <input type="hidden" name="priceTableId" value={table.id} />
                  <input type="hidden" name="productId" value={product.id} />
                  <input
                    name="optionsCombinationHash"
                    placeholder="Комбинация (* для всех)"
                    className="rounded-lg border px-3 py-2"
                    defaultValue="*"
                  />
                  <input name="quantityFrom" type="number" placeholder="От" className="rounded-lg border px-3 py-2" />
                  <input name="quantityTo" type="number" placeholder="До" className="rounded-lg border px-3 py-2" />
                  <input
                    name="unitNetPrice"
                    type="number"
                    step="0.01"
                    placeholder="Цена"
                    className="rounded-lg border px-3 py-2"
                  />
                  <input
                    name="productionDays"
                    type="number"
                    placeholder="Дни"
                    className="rounded-lg border px-3 py-2"
                  />
                  <button type="submit" className="px-3 py-2 rounded-lg bg-brand-600 text-white md:col-span-6">
                    Добавить
                  </button>
                </form>
              </details>
            </div>
          ))}
          {product.priceTables.length === 0 && <p className="text-sm text-gray-500">Таблиц цен пока нет.</p>}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Удаление товара</h2>
        <p className="text-sm text-red-600 mb-3">Действие необратимо. Товар и связанные сущности будут удалены.</p>
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <button type="submit" className="px-4 py-2 rounded-lg border border-red-400 text-red-700 hover:bg-red-50">
            Удалить товар
          </button>
        </form>
      </section>
    </div>
  );
}
