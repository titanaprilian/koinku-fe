import { useQuery, queryOptions } from '@tanstack/react-query';
import { meApi } from '../api';

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

export const meQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.me(),
    queryFn: meApi,
    staleTime: 5 * 60 * 1000, // 5 minutes — profile data rarely changes
  });

export function useMe() {
  return useQuery(meQueryOptions());
}
