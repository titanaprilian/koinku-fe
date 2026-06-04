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
