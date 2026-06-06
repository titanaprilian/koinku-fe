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
      <DialogContent className="sm:max-w-md rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
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
          <div className="space-y-6 pt-4">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {user.name.split(/\s+/).map(n => n[0] || '').join('').substring(0, 2).toUpperCase() || '??'}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* User Information Grid */}
            <div className="grid grid-cols-[100px_1fr] items-center gap-y-4">
              <div className="text-sm font-medium text-muted-foreground">Role</div>
              <div className="text-sm text-foreground">{user.roleName}</div>
              
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="text-sm text-foreground">
                {user.isActive ? (
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Active
                  </Badge>
                ) : (
                  <Badge className="border-border bg-muted text-muted-foreground hover:bg-muted/80">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            {/* Administrative Metadata */}
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <h4 className="text-sm font-semibold text-foreground">System Information</h4>
              <div className="grid grid-cols-[80px_1fr] gap-y-2">
                <div className="text-xs font-medium text-muted-foreground">ID</div>
                <div className="break-all font-mono text-xs text-foreground">{user.id}</div>
                
                <div className="text-xs font-medium text-muted-foreground">Created</div>
                <div className="text-xs text-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
                
                <div className="text-xs font-medium text-muted-foreground">Updated</div>
                <div className="text-xs text-foreground">{new Date(user.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
