import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api';
import type { DashboardResponse } from '../types';

export function useDashboardStats() {
  return useQuery<DashboardResponse>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
}
