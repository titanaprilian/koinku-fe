import { useQuery } from '@tanstack/react-query';
import { getRoleById } from '../api';

export function useRoleById(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
}
