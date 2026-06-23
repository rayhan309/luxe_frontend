import apiClient from './client';
import type { APIResponse, PaginatedResponse, Order, CreateOrderInput } from '@/types';
export type { CreateOrderInput };

export const ordersAPI = {
  createOrder: (data: CreateOrderInput) =>
    apiClient.post<APIResponse<Order>>('/orders', data),

  getMyOrders: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Order>>('/orders', { params }),

  getOrderById: (id: string) =>
    apiClient.get<APIResponse<Order>>(`/orders/${id}`),

  validateCoupon: (code: string, order_amount: number) =>
    apiClient.post<APIResponse<{ valid: boolean; discount_amount: number; message: string }>>('/coupons/validate', { code, order_amount }),

  // Admin
  adminListOrders: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Order>>('/admin/orders', { params }),

  adminUpdateStatus: (id: string, status: string, note?: string) =>
    apiClient.put<APIResponse<null>>(`/admin/orders/${id}/status`, { status, note }),
};
