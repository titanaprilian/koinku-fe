import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useUsers } from '@/features/users/hooks/use-users';
import { UsersFilters } from '@/features/users/components/users-filters';
import { UsersTable } from '@/features/users/components/users-table';
import { CreateUserForm } from '@/features/users/components/create-user-form';
import { UserDetailDialog } from '@/features/users/components/user-detail-dialog';
import { EditUserForm } from '@/features/users/components/edit-user-form';
import { DeleteUserDialog } from '@/features/users/components/delete-user-dialog';
import type { GetUsersParams } from '@/features/users/types';

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search: Record<string, unknown>): GetUsersParams => {
    let parsedIsActive: boolean | undefined = undefined;
    if (search.isActive !== undefined) {
      parsedIsActive = search.isActive === 'true' || search.isActive === true;
    }

    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
      roleId: search.roleId as string | undefined,
      isActive: parsedIsActive,
    };
  },
  component: UsersPage,
});

function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const { data, isLoading } = useUsers(searchParams);

  const updateFilters = (newFilters: Partial<GetUsersParams>) => {
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

  const handleLimitChange = (limit: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        limit,
        page: 1,
      }),
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <Button id="add-user-button" onClick={() => setCreateOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersFilters
        search={searchParams.search || ''}
        roleId={searchParams.roleId || ''}
        isActive={searchParams.isActive}
        onFilterChange={updateFilters}
      />

      <UsersTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onDetail={setSelectedUserId}
        onEdit={setEditUserId}
        onDelete={setDeleteUserId}
      />

      <CreateUserForm open={createOpen} onOpenChange={setCreateOpen} />
      <UserDetailDialog
        userId={selectedUserId}
        onOpenChange={(open) => {
          if (!open) setSelectedUserId(null);
        }}
      />
      <EditUserForm
        userId={editUserId}
        onOpenChange={(open) => {
          if (!open) setEditUserId(null);
        }}
      />
      <DeleteUserDialog
        userId={deleteUserId}
        onOpenChange={(open) => {
          if (!open) setDeleteUserId(null);
        }}
      />
    </div>
  );
}

