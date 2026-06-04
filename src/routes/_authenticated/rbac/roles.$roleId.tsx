import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useRoleById } from '@/features/roles/hooks/use-role-by-id';
import { RolePermissionsTable } from '@/features/roles/components/role-permissions-table';

export const Route = createFileRoute('/_authenticated/rbac/roles/$roleId')({
  component: RoleDetailPage,
});

function RoleDetailPage() {
  const { roleId } = Route.useParams();
  const { data, isLoading, isError } = useRoleById(roleId);

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading role details...</div>;
  }

  if (isError || !data?.data) {
    return <div className="p-6 text-center text-destructive">Failed to load role details.</div>;
  }

  const role = data.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/rbac/roles"
          className={buttonVariants({ variant: 'outline', size: 'icon' })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{role.name}</h1>
          <p className="text-muted-foreground">{role.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Permissions</h2>
        <RolePermissionsTable permissions={role.permissions} />
      </div>
    </div>
  );
}
