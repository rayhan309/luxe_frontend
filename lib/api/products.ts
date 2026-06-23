import apiClient from './client';
import type { APIResponse, PaginatedResponse, Product, ProductFilter, CreateProductInput } from '@/types';
export type { CreateProductInput };

export const productsAPI = {
  list: (params?: ProductFilter) =>
    apiClient.get<PaginatedResponse<Product>>('/products', { params }),

  getBySlug: (slug: string) =>
    apiClient.get<APIResponse<Product>>(`/products/${slug}`),

  getFeatured: () =>
    apiClient.get<APIResponse<Product[]>>('/products/featured'),

  getBestSellers: () =>
    apiClient.get<APIResponse<Product[]>>('/products/best-sellers'),

  getNewArrivals: () =>
    apiClient.get<APIResponse<Product[]>>('/products/new-arrivals'),

  getRelated: (slug: string, categoryId: string) =>
    apiClient.get<APIResponse<Product[]>>(`/products/${slug}/related`, { params: { category: categoryId } }),

  // Admin
  adminList: (params?: { search?: string; status?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Product>>('/admin/products', { params }),

  adminCreate: (data: CreateProductInput) =>
    apiClient.post<APIResponse<Product>>('/admin/products', data),

  adminUpdate: (id: string, data: Partial<CreateProductInput>) =>
    apiClient.put<APIResponse<Product>>(`/admin/products/${id}`, data),

  adminDelete: (id: string) =>
    apiClient.delete<APIResponse<null>>(`/admin/products/${id}`),
};
