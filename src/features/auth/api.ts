import { api } from '@/api/client';
import type { LoginRequest, LoginResponse } from './types';

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}
