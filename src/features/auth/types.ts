export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
