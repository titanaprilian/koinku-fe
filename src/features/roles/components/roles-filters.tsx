import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface RolesFiltersProps {
  search: string;
  onFilterChange: (filters: { search?: string }) => void;
}

export function RolesFilters({ search, onFilterChange }: RolesFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onFilterChange({ 
          search: localSearch
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, search, onFilterChange]);

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search roles..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
