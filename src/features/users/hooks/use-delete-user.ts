import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../api';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalidate all paginated users queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Success", { description: "User deleted successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to delete user";
      toast.error("Error", { description: message || "Failed to delete user" });
    },
  });
}


