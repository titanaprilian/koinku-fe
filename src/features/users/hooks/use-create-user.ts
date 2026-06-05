import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api';
import type { CreateUserPayload } from '../types';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Invalidate all paginated users queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success("Success", { description: "User created successfully" });
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
        ? error.message
        : "Failed to create user";
      toast.error("Error", { description: message || "Failed to create user" });
    },
  });
}


