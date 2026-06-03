import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useUsers } from '@/features/users/hooks/use-users';
import { UsersFilters } from '@/features/users/components/users-filters';
import { UsersTable } from '@/features/users/components/users-table';
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
  
  // Ensure we are fetching the right data for the current URL params
  const { data, isLoading } = useUsers(searchParams);

  const updateFilters = (newFilters: Partial<GetUsersParams>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...newFilters,
        page: 1, // Reset page on filter change
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
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
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
      />
    </div>
  );
}
