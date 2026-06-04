import { Type, type Static } from '@sinclair/typebox';

export const CreateUserSchema = Type.Object({
  email: Type.String({ format: 'email', minLength: 1 }),
  name: Type.String({ minLength: 2, maxLength: 50 }),
  password: Type.String({ minLength: 8 }),
  roleId: Type.String({ minLength: 1 }),
  isActive: Type.Boolean(),
});

export type CreateUserPayload = Static<typeof CreateUserSchema>;

export interface CreateUserResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    roleId: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiErrorResponse {
  error: boolean;
  code: number;
  message: string;
  issues: { path: string; message: string }[] | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  roleId: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
}

export interface PaginatedUsersResponse {
  error: boolean;
  code: number;
  message: string;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetUserByIdResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    isActive: boolean;
    roleId: string;
    roleName: string;
    createdAt: string;
    updatedAt: string;
  };
}

