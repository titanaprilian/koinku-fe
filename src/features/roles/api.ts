import { api } from '@/api/client';
import type {
  GetRoleOptionsParams,
  PaginatedRoleOptionsResponse,
  GetRolesParams,
  PaginatedRolesResponse,
} from './types';

export async function getRoleOptions(params?: GetRoleOptionsParams): Promise<PaginatedRoleOptionsResponse> {
  const { data } = await api.get<PaginatedRoleOptionsResponse>('/rbac/roles/options', { params });
  return data;
}

export async function getRoles(params: GetRolesParams): Promise<PaginatedRolesResponse> {
  const { data } = await api.get<PaginatedRolesResponse>('/rbac/roles', { params });
  return data;
}
