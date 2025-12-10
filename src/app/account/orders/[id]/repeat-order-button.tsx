'use client';

import { useRouter } from 'next/navigation';
import { useCartStore, UploadedFileRef } from '@/lib/store';
import { useTransition } from 'react';

type Item = {
  id: number;
  productId: number;
  title: string;
  quantity: number;
  unitNetPrice: number;
  totalNet: number;
  options: string;
  files: UploadedFileRef[];
};

export function RepeatOrderButton({ items }: { items: Item[] }) {
  const addItem = useCartStore((state) => state.addItem);
  const clear = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleRepeat = () => {
    startTransition(() => {
      clear();
      items.forEach((item) => {
        let parsedOptions: Record<string, string> = {};
        try {
          parsedOptions = JSON.parse(item.options || '{}');
        } catch (e) {
          parsedOptions = {};
        }
        addItem({
          productId: item.productId,
          title: item.title,
          options: parsedOptions,
          price: item.totalNet,
          quantity: item.quantity,
          files: item.files,
        });
      });
      router.push('/checkout');
    });
  };

  return (
    <button
      onClick={handleRepeat}
      disabled={pending}
      className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
    >
      {pending ? 'Повторяю...' : 'Повторить заказ'}
    </button>
  );
}
