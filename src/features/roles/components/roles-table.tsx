import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EyeIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role, PaginatedRolesResponse } from '../types';

interface RolesTableProps {
  data?: PaginatedRolesResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (role: Role) => void;
}

export function RolesTable({
  data,
  isLoading,
  onPageChange,
  onLimitChange,
  onView,
  onEdit,
  onDelete,
}: RolesTableProps) {
  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading roles...</div>;
  if (!data) return null;

  const startNumber = (data.pagination.page - 1) * data.pagination.limit;

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="w-[80px] px-4 py-3 text-muted-foreground font-medium">No.</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Description</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Created At</TableHead>
              <TableHead className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((role: Role, index: number) => (
              <TableRow key={role.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-4 text-muted-foreground font-medium">{startNumber + index + 1}</TableCell>
                <TableCell className="px-4 py-4 font-medium">{role.name}</TableCell>
                <TableCell className="px-4 py-4 text-muted-foreground">{role.description}</TableCell>
                <TableCell className="px-4 py-4 text-muted-foreground">{new Date(role.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1 px-4 py-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted text-muted-foreground"
                    onClick={() => onView(role.id)}
                    title="Detail"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">Detail</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted text-muted-foreground"
                    onClick={() => onEdit(role.id)}
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                    onClick={() => onDelete(role)}
                    title="Delete"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No roles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={data.pagination.limit.toString()}
              onValueChange={(val) => onLimitChange(Number(val))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={data.pagination.limit.toString()} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page - 1)}
              disabled={data.pagination.page <= 1}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-9 px-4 text-sm font-medium">
              {data.pagination.page}
            </div>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-muted px-4"
              onClick={() => onPageChange(data.pagination.page + 1)}
              disabled={data.pagination.page >= data.pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

