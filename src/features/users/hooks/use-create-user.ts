import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api';
import type { CreateUserPayload } from '../types';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Invalidate all paginated users queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
