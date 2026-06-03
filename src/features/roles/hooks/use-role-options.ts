import { useQuery } from '@tanstack/react-query';
import { getRoleOptions } from '../api';
import type { GetRoleOptionsParams } from '../types';

export function useRoleOptions(params?: GetRoleOptionsParams) {
  return useQuery({
    queryKey: ['role-options', params],
    queryFn: () => getRoleOptions(params),
  });
}
