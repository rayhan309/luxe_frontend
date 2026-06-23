import apiClient from './client';
import type { APIResponse } from '@/types';

export const wishlistAPI = {
  get: () => apiClient.get<APIResponse<string[]>>('/wishlist'),

  toggle: (productId: string) =>
    apiClient.post<APIResponse<null>>(`/wishlist/${productId}`),
};
