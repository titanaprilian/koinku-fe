import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getUsers } from '../api';
import type { GetUsersParams } from '../types';

export function useUsers(params: GetUsersParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
}
