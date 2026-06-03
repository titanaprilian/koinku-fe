export interface UserDistribution {
  roleName: string;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  totalFeatures: number;
  userDistribution: UserDistribution[];
}

export interface DashboardResponse {
  error: boolean;
  code: number;
  message: string;
  data: DashboardStats;
}
