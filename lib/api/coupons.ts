import apiClient from './client';
import type { APIResponse, PaginatedResponse, Coupon } from '@/types';

export interface CreateCouponInput {
  code: string;
  description?: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  usage_limit?: number;
  user_usage_limit?: number;
  is_active?: boolean;
  starts_at: string;
  expires_at: string;
}

export const couponsAPI = {
  adminList: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Coupon>>('/admin/coupons', { params }),

  adminCreate: (data: CreateCouponInput) =>
    apiClient.post<APIResponse<Coupon>>('/admin/coupons', data),

  adminUpdate: (id: string, data: Partial<CreateCouponInput>) =>
    apiClient.put<APIResponse<Coupon>>(`/admin/coupons/${id}`, data),

  adminDelete: (id: string) =>
    apiClient.delete<APIResponse<null>>(`/admin/coupons/${id}`),
};
