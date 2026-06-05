import { api } from '@/api/client';
import type {
  GetRoleOptionsParams,
  PaginatedRoleOptionsResponse,
  GetRolesParams,
  PaginatedRolesResponse,
  GetRoleByIdResponse,
  GetFeaturesParams,
  PaginatedFeaturesResponse,
  CreateRolePayload,
  CreateRoleResponse,
  EditRolePayload,
  EditRoleResponse,
  DeleteRoleResponse,
} from './types';

export async function getRoleOptions(params?: GetRoleOptionsParams): Promise<PaginatedRoleOptionsResponse> {
  const { data } = await api.get<PaginatedRoleOptionsResponse>('/rbac/roles/options', { params });
  return data;
}

export async function getRoles(params: GetRolesParams): Promise<PaginatedRolesResponse> {
  const { data } = await api.get<PaginatedRolesResponse>('/rbac/roles', { params });
  return data;
}

export async function getRoleById(id: string): Promise<GetRoleByIdResponse> {
  const { data } = await api.get<GetRoleByIdResponse>(`/rbac/roles/${id}`);
  return data;
}

export async function getFeatures(params?: GetFeaturesParams): Promise<PaginatedFeaturesResponse> {
  const { data } = await api.get<PaginatedFeaturesResponse>('/rbac/features', { params });
  return data;
}

export async function createRole(payload: CreateRolePayload): Promise<CreateRoleResponse> {
  const { data } = await api.post<CreateRoleResponse>('/rbac/roles', payload);
  return data;
}

export async function editRole(id: string, payload: EditRolePayload): Promise<EditRoleResponse> {
  const { data } = await api.patch<EditRoleResponse>(`/rbac/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id: string): Promise<DeleteRoleResponse> {
  const { data } = await api.delete<DeleteRoleResponse>(`/rbac/roles/${id}`);
  return data;
}
