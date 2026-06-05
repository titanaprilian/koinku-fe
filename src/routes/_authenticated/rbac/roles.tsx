import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRoles } from '@/features/roles/hooks/use-roles';
import { RolesFilters } from '@/features/roles/components/roles-filters';
import { RolesTable } from '@/features/roles/components/roles-table';
import type { GetRolesParams, Role } from '@/features/roles/types';
import { RoleDetailDialog } from '@/features/roles/components/role-detail-dialog';
import { CreateRoleDialog } from '@/features/roles/components/create-role-dialog';
import { EditRoleDialog } from '@/features/roles/components/edit-role-dialog';
import { DeleteRoleDialog } from '@/features/roles/components/delete-role-dialog';

export const Route = createFileRoute('/_authenticated/rbac/roles')({
  validateSearch: (search: Record<string, unknown>): GetRolesParams => {
    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
    };
  },
  component: RolesPage,
});

function RolesPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [viewRoleId, setViewRoleId] = useState<string | null>(null);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const { data, isLoading } = useRoles(searchParams);

  const updateFilters = (newFilters: Partial<GetRolesParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }),
    });
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page,
      }),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <RolesFilters
        search={searchParams.search || ''}
        onFilterChange={updateFilters}
      />

      <RolesTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onView={setViewRoleId}
        onEdit={setEditRoleId}
        onDelete={setDeleteRole}
      />

      <RoleDetailDialog
        roleId={viewRoleId}
        onOpenChange={(open) => {
          if (!open) setViewRoleId(null);
        }}
      />

      <EditRoleDialog
        roleId={editRoleId}
        onOpenChange={(open) => {
          if (!open) setEditRoleId(null);
        }}
      />

      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <DeleteRoleDialog
        role={deleteRole}
        onOpenChange={(open) => {
          if (!open) setDeleteRole(null);
        }}
      />
    </div>
  );
}

