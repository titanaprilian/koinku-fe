import { api } from '@/api/client';
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from './types';

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

export async function refreshApi(body: RefreshRequest): Promise<RefreshResponse> {
  const response = await api.post<RefreshResponse>('/auth/refresh', body);
  return response.data;
}
