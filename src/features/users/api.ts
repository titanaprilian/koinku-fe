import { api } from '@/api/client';
import type { GetUsersParams, PaginatedUsersResponse } from './types';

export async function getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
  return data;
}
