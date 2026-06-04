import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../api';

export function useUserById(id: string | null) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserById(id!),
    enabled: id !== null,
  });
}
