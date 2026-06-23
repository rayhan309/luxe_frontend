import apiClient from './client';
import type { APIResponse, PaginatedResponse, Cart, AddToCartInput } from '@/types';
export type { AddToCartInput };

export const cartAPI = {
  getCart: () =>
    apiClient.get<APIResponse<Cart>>('/cart'),

  addItem: (data: AddToCartInput) =>
    apiClient.post<APIResponse<Cart>>('/cart', data),

  updateItem: (itemId: string, quantity: number) =>
    apiClient.put<APIResponse<Cart>>(`/cart/${itemId}`, { quantity }),

  removeItem: (itemId: string) =>
    apiClient.delete<APIResponse<Cart>>(`/cart/${itemId}`),

  clear: () =>
    apiClient.delete<APIResponse<null>>('/cart'),
};
