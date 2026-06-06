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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { User, PaginatedUsersResponse } from '../types';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { generatePaginationLinks } from '@/lib/pagination';

interface UsersTableProps {
  data?: PaginatedUsersResponse;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onDetail: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export function UsersTable({
  data,
  isLoading,
  onPageChange,
  onLimitChange,
  onDetail,
  onEdit,
  onDelete,
}: UsersTableProps) {
  if (isLoading) return <div className="p-6 text-center text-muted-foreground">Loading users...</div>;
  if (!data) return null;

  const startNumber = (data.pagination.page - 1) * data.pagination.limit;

  return (
    <div className="w-full">
      <div className="w-full overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="w-[80px] px-4 py-3 text-center text-muted-foreground font-medium">No.</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="px-4 py-3 text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="px-4 py-3 text-right text-muted-foreground font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((user: User, index: number) => (
              <TableRow key={user.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-4 text-center text-muted-foreground font-medium">{startNumber + index + 1}</TableCell>
                <TableCell className="px-4 py-4 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4">{user.email}</TableCell>
                <TableCell className="px-4 py-4">{user.roleName}</TableCell>
                <TableCell className="px-4 py-4">
                  {user.isActive ? (
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100">Active</Badge>
                  ) : (
                    <Badge className="border-border bg-muted text-muted-foreground hover:bg-muted/80">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-1 px-4 py-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    id={`detail-user-${user.id}`}
                    className="hover:bg-muted text-muted-foreground"
                    onClick={() => onDetail(user.id)}
                    title="Detail"
                  >
                    <EyeIcon className="h-4 w-4" />
                    <span className="sr-only">Detail</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    id={`edit-user-${user.id}`}
                    className="hover:bg-muted text-muted-foreground"
                    onClick={() => onEdit(user.id)}
                    title="Edit"
                  >
                    <PencilIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    id={`delete-user-${user.id}`}
                    className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(user.id)}
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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-border">
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
          <div className="flex items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(data.pagination.page - 1)}
                    className={data.pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {generatePaginationLinks(data.pagination.page, data.pagination.totalPages).map((page, i) => (
                  <PaginationItem key={i}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === data.pagination.page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(data.pagination.page + 1)}
                    className={data.pagination.page >= data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
