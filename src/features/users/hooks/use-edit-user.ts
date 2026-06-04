import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUser } from '../api';
import type { EditUserPayload } from '../types';

export function useEditUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditUserPayload) => patchUser(id, payload),
    onSuccess: () => {
      // Invalidate both the list and the individual user cache
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
