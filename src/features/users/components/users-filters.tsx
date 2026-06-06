import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRoleOptions } from '@/features/roles/hooks/use-role-options';

interface UsersFiltersProps {
  search: string;
  roleId: string;
  isActive?: boolean;
  onFilterChange: (filters: { search?: string; roleId?: string; isActive?: boolean }) => void;
}

export function UsersFilters({ search, roleId, isActive, onFilterChange }: UsersFiltersProps) {
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleOptions({ limit: 100 });
  const roles = rolesData?.data || [];
  
  // Local state for debounce
  const [localSearch, setLocalSearch] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  // Sync local search if parent search changes externally
  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onFilterChange({ search: localSearch });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, onFilterChange]);

  // Find the selected role to display its name safely
  const selectedRole = roles.find(r => r.id === roleId);

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search users..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="max-w-sm"
      />
      
      <Select
        value={roleId || 'all'}
        onValueChange={(val) =>
          onFilterChange({ roleId: (!val || val === 'all') ? undefined : val })
        }
        disabled={isLoadingRoles}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={isLoadingRoles ? "Loading roles..." : "All Roles"}>
            {selectedRole ? selectedRole.name : (roleId && roleId !== 'all' ? 'Loading...' : 'All Roles')}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={isActive === undefined ? 'all' : isActive ? 'true' : 'false'}
        onValueChange={(val) =>
          onFilterChange({ isActive: val === 'all' ? undefined : val === 'true' })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status">
            {isActive === undefined ? 'All Statuses' : isActive ? 'Active' : 'Inactive'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="true">Active</SelectItem>
          <SelectItem value="false">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

