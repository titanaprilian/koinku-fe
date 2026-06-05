import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useDeleteRole } from '../hooks/use-delete-role';
import type { Role } from '../types';

interface DeleteRoleDialogProps {
  role: Role | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoleDialog({ role, onOpenChange }: DeleteRoleDialogProps) {
  const { mutate: deleteRoleMutate, isPending } = useDeleteRole();

  const handleDelete = () => {
    if (!role) return;
    deleteRoleMutate(role.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={!!role} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the role {role?.name ? `"${role.name}"` : ''}? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
