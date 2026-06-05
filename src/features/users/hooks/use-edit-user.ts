import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUser } from '../api';
import type { EditUserPayload } from '../types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function useEditUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditUserPayload) => patchUser(id, payload),
    onSuccess: () => {
      // Invalidate both the list and the individual user cache
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      toast.success("Success", { description: "User updated successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to update user";
      toast.error("Error", { description: message || "Failed to update user" });
    },
  });
}


