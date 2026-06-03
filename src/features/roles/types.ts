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
