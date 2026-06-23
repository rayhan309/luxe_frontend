import apiClient from './client';
import type { APIResponse, Banner } from '@/types';

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  image: string;
  mobile_image?: string;
  link?: string;
  button_text?: string;
  position: 'hero' | 'mid' | 'bottom';
  sort_order?: number;
  is_active?: boolean;
  starts_at?: string;
  expires_at?: string;
}

export const bannersAPI = {
  list: (position?: string) =>
    apiClient.get<APIResponse<Banner[]>>('/banners', { params: position ? { position } : undefined }),

  adminList: () => apiClient.get<APIResponse<Banner[]>>('/admin/banners'),

  adminCreate: (data: CreateBannerInput) =>
    apiClient.post<APIResponse<Banner>>('/admin/banners', data),

  adminUpdate: (id: string, data: Partial<CreateBannerInput>) =>
    apiClient.put<APIResponse<Banner>>(`/admin/banners/${id}`, data),

  adminDelete: (id: string) =>
    apiClient.delete<APIResponse<null>>(`/admin/banners/${id}`),
};
