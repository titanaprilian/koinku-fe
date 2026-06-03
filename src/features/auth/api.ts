import { api } from '@/api/client';
import type { LoginRequest, LoginResponse, RefreshResponse } from './types';

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}

export async function refreshApi(): Promise<RefreshResponse> {
  // No body needed — the HttpOnly cookie is sent automatically by the browser
  const response = await api.post<RefreshResponse>('/auth/refresh');
  return response.data;
}

export async function logoutApi(): Promise<void> {
  // Tells the backend to clear the refresh_token cookie
  await api.post('/auth/logout');
}
