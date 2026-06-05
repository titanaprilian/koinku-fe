import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editRole } from '../api';
import type { EditRolePayload } from '../types';

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
    },
  });
}
