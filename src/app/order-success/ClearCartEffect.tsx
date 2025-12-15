'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export default function ClearCartEffect() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
