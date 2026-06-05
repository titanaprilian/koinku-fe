import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editRole } from '../api';
import type { EditRolePayload } from '../types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

interface EditRoleParams {
  id: string;
  payload: EditRolePayload;
}

export function useEditRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: EditRoleParams) => editRole(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      toast.success("Success", { description: "Role updated successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to update role";
      toast.error("Error", { description: message || "Failed to update role" });
    },
  });
}


