import { api } from '@/api/client';
import type {
  GetUsersParams,
  PaginatedUsersResponse,
  CreateUserPayload,
  CreateUserResponse,
  GetUserByIdResponse,
} from './types';

export async function getUsers(params: GetUsersParams): Promise<PaginatedUsersResponse> {
  const { data } = await api.get<PaginatedUsersResponse>('/users', { params });
  return data;
}

export async function createUser(payload: CreateUserPayload): Promise<CreateUserResponse> {
  const { data } = await api.post<CreateUserResponse>('/users/', payload);
  return data;
}

export async function getUserById(id: string): Promise<GetUserByIdResponse> {
  const { data } = await api.get<GetUserByIdResponse>(`/users/${id}`);
  return data;
}


