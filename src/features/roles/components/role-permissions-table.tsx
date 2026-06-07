import { Check, Minus } from 'lucide-react';
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
      <Minus className="h-5 w-5 text-slate-300 dark:text-slate-700 mx-auto" />
    );
  };

  return (
    <div className="w-full max-h-[350px] overflow-y-auto border rounded-lg relative">
      <Table>
        <TableHeader className="sticky top-0 bg-slate-50 dark:bg-zinc-900 z-10 shadow-xs">
          <TableRow className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-transparent">
            <TableHead className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-semibold">Feature</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Create</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Read</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Update</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Delete</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Print</TableHead>
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
              <TableRow key={perm.featureId} className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
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
