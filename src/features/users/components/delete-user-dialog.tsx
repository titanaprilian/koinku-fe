import { Loader2 } from 'lucide-react';

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
import { useDeleteUser } from '../hooks/use-delete-user';
import { useUserById } from '../hooks/use-user-by-id';

interface DeleteUserDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ userId, onOpenChange }: DeleteUserDialogProps) {
  const { mutate: deleteUser, isPending, error } = useDeleteUser();
  const { data: userData } = useUserById(userId);

  const userName = userData?.data?.name ?? 'this user';

  function handleDelete() {
    if (!userId) return;
    deleteUser(userId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  // Extract server error message for display
  const serverError = error as {
    response?: { data?: { message?: string } };
  } | null;
  const serverMessage = serverError?.response?.data?.message;

  return (
    <AlertDialog open={userId !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{userName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {serverMessage && (
          <p className="text-sm text-destructive">{serverMessage}</p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            id="confirm-delete-user"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
