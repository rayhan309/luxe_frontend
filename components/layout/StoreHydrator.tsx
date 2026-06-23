'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { cartAPI } from '@/lib/api/cart';
import { wishlistAPI } from '@/lib/api/wishlist';

export default function StoreHydrator() {
  const { isAuthenticated } = useAuthStore();
  const { setCart } = useCartStore();
  const { setItems } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    cartAPI.getCart()
      .then(({ data }) => setCart(data.data))
      .catch(() => {});

    wishlistAPI.get()
      .then(({ data }) => setItems(data.data || []))
      .catch(() => {});
  }, [isAuthenticated, setCart, setItems]);

  return null;
}
