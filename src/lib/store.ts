import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string; // Unique ID (timestamp + random)
  productId: string;
  title: string;
  options: Record<string, string>; // Selected options { paper: '350_matt', quantity: '100' }
  price: number;
  quantity: number; // Number of "sets" (usually 1 for printing products)
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Math.random().toString(36).substring(7) }]
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      clearCart: () => set({ items: [] }),

      totalPrice: () => get().items.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: 'print-cart-storage',
    }
  )
);
