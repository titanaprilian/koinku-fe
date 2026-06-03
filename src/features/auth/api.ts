import { api } from '@/api/client';
import type { LoginRequest, LoginResponse, RefreshResponse } from './types';

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

export async function refreshApi(): Promise<RefreshResponse> {
  // Send an empty object {} as body to satisfy backend schema validation
  const response = await api.post<RefreshResponse>('/auth/refresh', {});
  return response.data;
}

export async function logoutApi(): Promise<void> {
  // Send an empty object {} as body to satisfy backend schema validation
  await api.post('/auth/logout', {});
}
