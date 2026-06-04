import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getRoles } from '../api';
import type { GetRolesParams } from '../types';

export function useRoles(params: GetRolesParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => getRoles(params),
    placeholderData: keepPreviousData,
  });
}
