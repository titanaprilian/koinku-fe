import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRole } from '../api';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Success", { description: "Role deleted successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to delete role";
      toast.error("Error", { description: message || "Failed to delete role" });
    },
  });
}


