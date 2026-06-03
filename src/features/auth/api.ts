import { api } from '@/api/client';
import type { LoginRequest, LoginResponse, RefreshResponse, MeResponse } from './types';

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

export async function meApi(): Promise<MeResponse> {
  const response = await api.get<MeResponse>('/auth/me');
  return response.data;
}
