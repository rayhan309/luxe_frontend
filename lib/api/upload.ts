import apiClient from './client';
import type { APIResponse } from '@/types';

interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

export const uploadAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<APIResponse<UploadResult>>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
