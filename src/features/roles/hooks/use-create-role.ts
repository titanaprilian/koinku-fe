import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole } from '../api';
import type { CreateRolePayload } from '../types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRolePayload) => createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success("Success", { description: "Role created successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to create role";
      toast.error("Error", { description: message || "Failed to create role" });
    },
  });
}


