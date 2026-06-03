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
