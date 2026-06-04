import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate all paginated users queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
