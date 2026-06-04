import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRoleById } from '../hooks/use-role-by-id';
import { RolePermissionsTable } from './role-permissions-table';

interface RoleDetailDialogProps {
  roleId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function RoleDetailDialog({ roleId, onOpenChange }: RoleDetailDialogProps) {
  const { data, isLoading, isError } = useRoleById(roleId ?? '');

  const role = data?.data;

  return (
    <Dialog open={roleId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Role Details</DialogTitle>
          <DialogDescription>
            View detailed information and permissions for this role.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading details...</span>
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-destructive">Failed to load role details.</div>
        ) : role ? (
          <div className="space-y-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left border rounded-xl p-5 bg-card shadow-xs">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Role ID</h4>
                <p className="text-sm font-mono bg-muted/60 px-2 py-1 rounded inline-block select-all">{role.id}</p>
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Name</h4>
                <p className="text-sm font-medium text-foreground">{role.name}</p>
              </div>
              <div className="md:col-span-2 space-y-1 border-t border-border pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {role.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-left text-base text-foreground">Permissions</h4>
              <RolePermissionsTable permissions={role.permissions} />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
