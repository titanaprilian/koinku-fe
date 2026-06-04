import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Role, PaginatedRolesResponse } from '../types';

interface RolesTableProps {
  data?: PaginatedRolesResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onView: (id: string) => void;
}

export function RolesTable({ data, isLoading, onPageChange, onView }: RolesTableProps) {
  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading roles...</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((role: Role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(role.id)}
                  >
                    <EyeIcon className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.data.length > 0 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page - 1)}
            disabled={data.pagination.page <= 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground font-medium px-2">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(data.pagination.page + 1)}
            disabled={data.pagination.page >= data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
