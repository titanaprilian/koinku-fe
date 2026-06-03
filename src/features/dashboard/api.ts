import { api } from '@/api/client';
import type { DashboardResponse } from './types';

export async function getDashboardStats(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>('/dashboard/');
  return response.data;
}
