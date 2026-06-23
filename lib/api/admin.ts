import apiClient from './client';
import type { APIResponse, PaginatedResponse, User, OrderStats, RevenuePoint } from '@/types';

export const adminAPI = {
  dashboard: (days = 30) =>
    apiClient.get<APIResponse<{ stats: OrderStats; chart: RevenuePoint[] }>>('/admin/dashboard', {
      params: { days },
    }),

  listCustomers: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<User>>('/admin/customers', { params }),
};
