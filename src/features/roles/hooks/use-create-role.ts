import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole } from '../api';
import type { CreateRolePayload } from '../types';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}
