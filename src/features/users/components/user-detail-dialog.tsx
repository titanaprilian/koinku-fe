import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserById } from '../hooks/use-user-by-id';

interface UserDetailDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ userId, onOpenChange }: UserDetailDialogProps) {
  const open = userId !== null;
  const { data, isLoading, isError } = useUserById(userId);
  const user = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Detail</DialogTitle>
          <DialogDescription>
            Read-only view of the selected user account.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-3 py-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-destructive py-2">
            User not found or an error occurred.
          </p>
        )}

        {user && !isLoading && (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Name</dt>
              <dd className="font-semibold">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Role</dt>
              <dd>{user.roleName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Status</dt>
              <dd>
                <Badge variant={user.isActive ? 'default' : 'secondary'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Created</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">Updated</dt>
              <dd>{new Date(user.updatedAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground font-medium">ID</dt>
              <dd className="font-mono text-xs break-all">{user.id}</dd>
            </div>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
