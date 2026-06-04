import { Check, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { RolePermission } from '../types';

interface RolePermissionsTableProps {
  permissions: RolePermission[];
}

export function RolePermissionsTable({ permissions }: RolePermissionsTableProps) {
  const renderIcon = (value: boolean) => {
    return value ? (
      <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-500 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground/60 mx-auto" />
    );
  };

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            <TableHead className="px-4 py-3 text-left text-muted-foreground font-medium">Feature</TableHead>
            <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">Create</TableHead>
            <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">Read</TableHead>
            <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">Update</TableHead>
            <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">Delete</TableHead>
            <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">Print</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No permissions assigned.
              </TableCell>
            </TableRow>
          ) : (
            permissions.map((perm) => (
              <TableRow key={perm.featureId} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-3 font-medium text-left">{perm.feature.name}</TableCell>
                <TableCell className="px-4 py-3 text-center">{renderIcon(perm.canCreate)}</TableCell>
                <TableCell className="px-4 py-3 text-center">{renderIcon(perm.canRead)}</TableCell>
                <TableCell className="px-4 py-3 text-center">{renderIcon(perm.canUpdate)}</TableCell>
                <TableCell className="px-4 py-3 text-center">{renderIcon(perm.canDelete)}</TableCell>
                <TableCell className="px-4 py-3 text-center">{renderIcon(perm.canPrint)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
