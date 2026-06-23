import apiClient from './client';
import type { APIResponse, Category } from '@/types';

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  is_active?: boolean;
  sort_order?: number;
}

export const categoriesAPI = {
  list: () => apiClient.get<APIResponse<Category[]>>('/categories'),

  getTree: () => apiClient.get<APIResponse<Category[]>>('/categories/tree'),

  getBySlug: (slug: string) =>
    apiClient.get<APIResponse<Category>>(`/categories/${slug}`),

  adminList: () => apiClient.get<APIResponse<Category[]>>('/admin/categories'),

  adminCreate: (data: CreateCategoryInput) =>
    apiClient.post<APIResponse<Category>>('/admin/categories', data),

  adminUpdate: (id: string, data: Partial<CreateCategoryInput>) =>
    apiClient.put<APIResponse<Category>>(`/admin/categories/${id}`, data),

  adminDelete: (id: string) =>
    apiClient.delete<APIResponse<null>>(`/admin/categories/${id}`),
};
