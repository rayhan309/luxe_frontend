'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  setCart: (cart: Cart) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  clearLocalCart: () => void;
  addLocalItem: (item: CartItem) => void;
}

const calculateItemCount = (cart: Cart | null): number => {
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
};

const calculateSubtotal = (cart: Cart | null): number => {
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      itemCount: 0,
      subtotal: 0,

      setCart: (cart) =>
        set({
          cart,
          itemCount: calculateItemCount(cart),
          subtotal: calculateSubtotal(cart),
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      clearLocalCart: () => set({ cart: null, itemCount: 0, subtotal: 0 }),

      addLocalItem: (item) => {
        const current = get().cart;
        if (current) {
          const existingIdx = current.items.findIndex(
            (i) => i.product_id === item.product_id && i.variant_id === item.variant_id
          );
          let newItems: CartItem[];
          if (existingIdx >= 0) {
            newItems = [...current.items];
            newItems[existingIdx] = {
              ...newItems[existingIdx],
              quantity: newItems[existingIdx].quantity + item.quantity,
            };
          } else {
            newItems = [...current.items, item];
          }
          const updatedCart = { ...current, items: newItems };
          set({
            cart: updatedCart,
            itemCount: calculateItemCount(updatedCart),
            subtotal: calculateSubtotal(updatedCart),
          });
        }
      },
    }),
    {
      name: 'luxe_cart',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
