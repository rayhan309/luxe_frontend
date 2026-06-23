import apiClient from './client';
import type { APIResponse, PaginatedResponse, Review } from '@/types';

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  title?: string;
  comment: string;
}

export const reviewsAPI = {
  getByProduct: (productId: string, params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Review>>(`/reviews/${productId}`, { params }),

  create: (data: CreateReviewInput) =>
    apiClient.post<APIResponse<Review>>('/reviews', data),

  adminList: (params?: { approved?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Review>>('/admin/reviews', { params }),

  adminApprove: (id: string) =>
    apiClient.put<APIResponse<null>>(`/admin/reviews/${id}/approve`),

  adminDelete: (id: string) =>
    apiClient.delete<APIResponse<null>>(`/admin/reviews/${id}`),
};
