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
      <Check className="h-5 w-5 text-green-600 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-muted-foreground mx-auto" />
    );
  };

  return (
    <div className="w-full overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead className="text-center">Create</TableHead>
            <TableHead className="text-center">Read</TableHead>
            <TableHead className="text-center">Update</TableHead>
            <TableHead className="text-center">Delete</TableHead>
            <TableHead className="text-center">Print</TableHead>
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
              <TableRow key={perm.featureId}>
                <TableCell className="font-medium">{perm.feature.name}</TableCell>
                <TableCell>{renderIcon(perm.canCreate)}</TableCell>
                <TableCell>{renderIcon(perm.canRead)}</TableCell>
                <TableCell>{renderIcon(perm.canUpdate)}</TableCell>
                <TableCell>{renderIcon(perm.canDelete)}</TableCell>
                <TableCell>{renderIcon(perm.canPrint)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
