import { Type, type Static } from '@sinclair/typebox';

export interface RoleOption {
  id: string;
  name: string;
}

export interface GetRoleOptionsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedRoleOptionsResponse {
  error: boolean;
  code: number;
  message: string;
  data: RoleOption[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedRolesResponse {
  error: boolean;
  code: number;
  message: string;
  data: Role[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RolePermission {
  featureId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
  feature: {
    id: string;
    name: string;
  };
}

export interface RoleDetail {
  id: string;
  name: string;
  description: string;
  permissions: RolePermission[];
  createdAt: string;
  updatedAt: string;
}

export interface GetRoleByIdResponse {
  error: boolean;
  code: number;
  message: string;
  data: RoleDetail;
}

// ─── Features ───────────────────────────────────────────────────────────────

export interface Feature {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetFeaturesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedFeaturesResponse {
  error: boolean;
  code: number;
  message: string;
  data: Feature[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Create Role ────────────────────────────────────────────────────────────

export interface PermissionPayload {
  featureId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canPrint: boolean;
}

export const CreateRoleSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
});

export type CreateRoleFormValues = Static<typeof CreateRoleSchema>;

export interface CreateRolePayload {
  name: string;
  description: string | null;
  permissions: PermissionPayload[];
}

export interface CreateRoleResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ─── Edit Role ──────────────────────────────────────────────────────────────

export const EditRoleSchema = Type.Object({
  name: Type.String({ minLength: 1 }),
  description: Type.Optional(Type.String()),
});

export type EditRoleFormValues = Static<typeof EditRoleSchema>;

export interface EditRolePayload {
  name: string;
  description: string | null;
  permissions: PermissionPayload[];
}

export interface EditRoleResponse {
  error: boolean;
  code: number;
  message: string;
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}
