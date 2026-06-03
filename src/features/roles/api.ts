import { api } from '@/api/client';
import type { GetRoleOptionsParams, PaginatedRoleOptionsResponse } from './types';

export async function getRoleOptions(params?: GetRoleOptionsParams): Promise<PaginatedRoleOptionsResponse> {
  const { data } = await api.get<PaginatedRoleOptionsResponse>('/rbac/roles/options', { params });
  return data;
}
