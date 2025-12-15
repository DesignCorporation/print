'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { handleError } from '@/lib/errors';

const parseBool = (value: FormDataEntryValue | null) => {
  if (value === null) return false;
  const str = typeof value === 'string' ? value : String(value);
  return str === 'on' || str === 'true' || str === '1';
};

const parseNumber = (value: FormDataEntryValue | null) => {
  if (value === null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

const parseString = (value: FormDataEntryValue | null) => (value ?? '').toString().trim();

export async function createProductAction(formData: FormData) {
  try {
    const category = parseString(formData.get('category'));
    const slug = parseString(formData.get('slug'));
    const name = parseString(formData.get('name'));
    const description = parseString(formData.get('description')) || null;
    const isActive = parseBool(formData.get('isActive'));

    if (!category || !slug || !name) {
      throw new Error('Заполните категорию, slug и название');
    }

    const product = await prisma.product.create({
      data: {
        category,
        slug,
        name,
        description,
        isActive,
      },
    });

    revalidatePath('/admin/products');
    redirect(`/admin/products/${product.id}`);
  } catch (error) {
    handleError(error, 'Не удалось создать товар');
  }
}

export async function updateProductAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    if (!id) throw new Error('Неизвестный товар');

    const category = parseString(formData.get('category'));
    const slug = parseString(formData.get('slug'));
    const name = parseString(formData.get('name'));
    const description = parseString(formData.get('description')) || null;
    const isActive = parseBool(formData.get('isActive'));

    await prisma.product.update({
      where: { id },
      data: { category, slug, name, description, isActive },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
  } catch (error) {
    handleError(error, 'Не удалось обновить товар');
  }
}

export async function deleteProductAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    if (!id) throw new Error('Неизвестный товар');

    await prisma.product.delete({ where: { id } });
    revalidatePath('/admin/products');
    redirect('/admin/products');
  } catch (error) {
    handleError(error, 'Не удалось удалить товар');
  }
}

export async function addOptionGroupAction(formData: FormData) {
  try {
    const productId = parseNumber(formData.get('productId'));
    if (!productId) throw new Error('Неизвестный товар');

    const name = parseString(formData.get('name'));
    const code = parseString(formData.get('code'));
    const inputType = parseString(formData.get('inputType')) || 'select';
    const sortOrder = parseNumber(formData.get('sortOrder')) ?? 0;

    if (!name) throw new Error('Введите название группы');

    await prisma.productOptionGroup.create({
      data: { productId, name, code, inputType, sortOrder },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось добавить группу опций');
  }
}

export async function updateOptionGroupAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная группа');

    const name = parseString(formData.get('name'));
    const code = parseString(formData.get('code'));
    const inputType = parseString(formData.get('inputType')) || 'select';
    const sortOrder = parseNumber(formData.get('sortOrder')) ?? 0;

    await prisma.productOptionGroup.update({
      where: { id },
      data: { name, code, inputType, sortOrder },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось обновить группу опций');
  }
}

export async function deleteOptionGroupAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная группа');

    await prisma.productOptionGroup.delete({ where: { id } });
    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось удалить группу опций');
  }
}

export async function addOptionAction(formData: FormData) {
  try {
    const groupId = parseNumber(formData.get('groupId'));
    const productId = parseNumber(formData.get('productId'));
    if (!groupId || !productId) throw new Error('Неизвестная группа');

    const label = parseString(formData.get('label'));
    const value = parseString(formData.get('value'));
    const code = parseString(formData.get('code')) || null;
    const priceFactor = parseNumber(formData.get('priceFactor'));
    const sortOrder = parseNumber(formData.get('sortOrder')) ?? 0;
    const isDefault = parseBool(formData.get('isDefault'));

    if (!label || !value) throw new Error('Введите название и значение опции');

    await prisma.productOption.create({
      data: { groupId, label, value, code, priceFactor, sortOrder, isDefault },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось добавить опцию');
  }
}

export async function updateOptionAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная опция');

    const label = parseString(formData.get('label'));
    const value = parseString(formData.get('value'));
    const code = parseString(formData.get('code')) || null;
    const priceFactor = parseNumber(formData.get('priceFactor'));
    const sortOrder = parseNumber(formData.get('sortOrder')) ?? 0;
    const isDefault = parseBool(formData.get('isDefault'));

    await prisma.productOption.update({
      where: { id },
      data: { label, value, code, priceFactor, sortOrder, isDefault },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось обновить опцию');
  }
}

export async function deleteOptionAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная опция');

    await prisma.productOption.delete({ where: { id } });
    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось удалить опцию');
  }
}

export async function addPriceTableAction(formData: FormData) {
  try {
    const productId = parseNumber(formData.get('productId'));
    if (!productId) throw new Error('Неизвестный товар');

    const name = parseString(formData.get('name'));
    const currency = parseString(formData.get('currency')) || 'PLN';

    if (!name) throw new Error('Введите название таблицы');

    await prisma.priceTable.create({
      data: { productId, name, currency },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось добавить таблицу цен');
  }
}

export async function updatePriceTableAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная таблица');

    const name = parseString(formData.get('name'));
    const currency = parseString(formData.get('currency')) || 'PLN';

    await prisma.priceTable.update({
      where: { id },
      data: { name, currency },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось обновить таблицу цен');
  }
}

export async function deletePriceTableAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная таблица');

    await prisma.priceTable.delete({ where: { id } });
    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось удалить таблицу цен');
  }
}

export async function addPriceRowAction(formData: FormData) {
  try {
    const priceTableId = parseNumber(formData.get('priceTableId'));
    const productId = parseNumber(formData.get('productId'));
    if (!priceTableId || !productId) throw new Error('Неизвестная таблица');

    const optionsCombinationHash = parseString(formData.get('optionsCombinationHash')) || '*';
    const quantityFrom = parseNumber(formData.get('quantityFrom')) ?? 1;
    const quantityTo = parseNumber(formData.get('quantityTo'));
    const unitNetPrice = parseNumber(formData.get('unitNetPrice')) ?? 0;
    const productionDays = parseNumber(formData.get('productionDays')) ?? 3;

    await prisma.priceRow.create({
      data: { priceTableId, optionsCombinationHash, quantityFrom, quantityTo, unitNetPrice, productionDays },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось добавить строку цены');
  }
}

export async function updatePriceRowAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная строка цены');

    const optionsCombinationHash = parseString(formData.get('optionsCombinationHash')) || '*';
    const quantityFrom = parseNumber(formData.get('quantityFrom')) ?? 1;
    const quantityTo = parseNumber(formData.get('quantityTo'));
    const unitNetPrice = parseNumber(formData.get('unitNetPrice')) ?? 0;
    const productionDays = parseNumber(formData.get('productionDays')) ?? 3;

    await prisma.priceRow.update({
      where: { id },
      data: { optionsCombinationHash, quantityFrom, quantityTo, unitNetPrice, productionDays },
    });

    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось обновить строку цены');
  }
}

export async function deletePriceRowAction(formData: FormData) {
  try {
    const id = parseNumber(formData.get('id'));
    const productId = parseNumber(formData.get('productId'));
    if (!id || !productId) throw new Error('Неизвестная строка цены');

    await prisma.priceRow.delete({ where: { id } });
    revalidatePath(`/admin/products/${productId}`);
  } catch (error) {
    handleError(error, 'Не удалось удалить строку цены');
  }
}
