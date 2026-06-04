import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface RolesFiltersProps {
  search: string;
  feature?: string;
  onFilterChange: (filters: { search?: string; feature?: string }) => void;
}

export function RolesFilters({ search, feature, onFilterChange }: RolesFiltersProps) {
  const [localSearch, setLocalSearch] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const [localFeature, setLocalFeature] = useState(feature || '');
  const [prevFeature, setPrevFeature] = useState(feature || '');

  if (search !== prevSearch) {
    setPrevSearch(search);
    setLocalSearch(search);
  }

  if (feature !== prevFeature) {
    setPrevFeature(feature || '');
    setLocalFeature(feature || '');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search || localFeature !== (feature || '')) {
        onFilterChange({ 
          search: localSearch,
          feature: localFeature || undefined
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, localFeature, search, feature, onFilterChange]);

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search roles..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="max-w-sm"
      />
      <Input
        placeholder="Filter by feature..."
        value={localFeature}
        onChange={(e) => setLocalFeature(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
