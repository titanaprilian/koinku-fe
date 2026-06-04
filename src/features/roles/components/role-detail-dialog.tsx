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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Role Details</DialogTitle>
          <DialogDescription>
            View detailed information and permissions for this role.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading details...</span>
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-destructive">Failed to load role details.</div>
        ) : role ? (
          <div className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Role ID</h4>
                <p className="text-sm mt-1">{role.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                <p className="text-sm mt-1 font-medium">{role.name}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm mt-1">{role.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-left">Permissions</h4>
              <RolePermissionsTable permissions={role.permissions} />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
