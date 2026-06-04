import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useRoles } from '@/features/roles/hooks/use-roles';
import { RolesFilters } from '@/features/roles/components/roles-filters';
import { RolesTable } from '@/features/roles/components/roles-table';
import type { GetRolesParams } from '@/features/roles/types';
import { RoleDetailDialog } from '@/features/roles/components/role-detail-dialog';

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
      />

      <RoleDetailDialog
        roleId={viewRoleId}
        onOpenChange={(open) => {
          if (!open) setViewRoleId(null);
        }}
      />
    </div>
  );
}

