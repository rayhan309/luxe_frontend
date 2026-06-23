import apiClient from './client';
import type { APIResponse, AuthResponse, User, Address, LoginInput, RegisterInput, UpdateProfileInput, ChangePasswordInput } from '@/types';
export type { LoginInput, RegisterInput, UpdateProfileInput, ChangePasswordInput };

export const authAPI = {
  register: (data: RegisterInput) =>
    apiClient.post<APIResponse<AuthResponse>>('/auth/register', data),

  login: (data: LoginInput) =>
    apiClient.post<APIResponse<AuthResponse>>('/auth/login', data),

  forgotPassword: (email: string) =>
    apiClient.post<APIResponse<{ reset_token: string }>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, new_password: string) =>
    apiClient.post<APIResponse<null>>('/auth/reset-password', { token, new_password }),

  getProfile: () =>
    apiClient.get<APIResponse<User>>('/profile'),

  updateProfile: (data: UpdateProfileInput) =>
    apiClient.put<APIResponse<User>>('/profile', data),

  changePassword: (data: ChangePasswordInput) =>
    apiClient.put<APIResponse<null>>('/profile/password', data),

  addAddress: (data: Omit<Address, 'id' | 'is_default'> & { is_default?: boolean }) =>
    apiClient.post<APIResponse<User>>('/profile/addresses', data),

  updateAddress: (addressId: string, data: Omit<Address, 'id' | 'is_default'> & { is_default?: boolean }) =>
    apiClient.put<APIResponse<User>>(`/profile/addresses/${addressId}`, data),

  deleteAddress: (addressId: string) =>
    apiClient.delete<APIResponse<User>>(`/profile/addresses/${addressId}`),
};
