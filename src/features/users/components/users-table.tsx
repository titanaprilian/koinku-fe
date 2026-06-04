import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import type { User, PaginatedUsersResponse } from '../types';

interface UsersTableProps {
  data?: PaginatedUsersResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onDetail: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UsersTable({ data, isLoading, onPageChange, onDetail, onEdit, onDelete }: UsersTableProps) {
  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading users...</div>;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    id={`detail-user-${user.id}`}
                    onClick={() => onDetail(user.id)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Detail
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    id={`edit-user-${user.id}`}
                    onClick={() => onEdit(user.id)}
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    id={`delete-user-${user.id}`}
                    onClick={() => onDelete?.(user.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No users found.
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
