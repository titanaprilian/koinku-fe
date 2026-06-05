import { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useFeatures } from '../hooks/use-features';
import { useCreateRole } from '../hooks/use-create-role';
import {
  CreateRoleSchema,
  type CreateRoleFormValues,
  type PermissionPayload,
} from '../types';

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OPERATIONS = ['canCreate', 'canRead', 'canUpdate', 'canDelete', 'canPrint'] as const;
type OperationKey = (typeof OPERATIONS)[number];

const OPERATION_LABELS: Record<OperationKey, string> = {
  canCreate: 'Create',
  canRead: 'Read',
  canUpdate: 'Update',
  canDelete: 'Delete',
  canPrint: 'Print',
};

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const { data: featuresData, isLoading: isLoadingFeatures } = useFeatures({ limit: 100 });
  const { mutate: createRoleMutation, isPending, error } = useCreateRole();

  const features = useMemo(() => featuresData?.data ?? [], [featuresData]);

  // Permissions state: { [featureId]: { canCreate, canRead, ... } }
  const [permissions, setPermissions] = useState<
    Record<string, Record<OperationKey, boolean>>
  >({});

  const form = useForm<CreateRoleFormValues>({
    resolver: typeboxResolver(CreateRoleSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const togglePermission = useCallback((featureId: string, op: OperationKey) => {
    setPermissions((prev) => {
      const current = prev[featureId] ?? {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canPrint: false,
      };
      return {
        ...prev,
        [featureId]: {
          ...current,
          [op]: !current[op],
        },
      };
    });
  }, []);

  const toggleSelectAll = useCallback((featureId: string) => {
    setPermissions((prev) => {
      const current = prev[featureId] ?? {
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
        canPrint: false,
      };
      const allChecked = OPERATIONS.every((op) => current[op]);
      const newValue = !allChecked;
      return {
        ...prev,
        [featureId]: {
          canCreate: newValue,
          canRead: newValue,
          canUpdate: newValue,
          canDelete: newValue,
          canPrint: newValue,
        },
      };
    });
  }, []);

  const isAllChecked = useCallback(
    (featureId: string): boolean => {
      const current = permissions[featureId];
      if (!current) return false;
      return OPERATIONS.every((op) => current[op]);
    },
    [permissions],
  );

  const isSomeChecked = useCallback(
    (featureId: string): boolean => {
      const current = permissions[featureId];
      if (!current) return false;
      const checkedCount = OPERATIONS.filter((op) => current[op]).length;
      return checkedCount > 0 && checkedCount < OPERATIONS.length;
    },
    [permissions],
  );

  function handleSubmit(values: CreateRoleFormValues) {
    const permissionsArray: PermissionPayload[] = features.map((feature) => ({
      featureId: feature.id,
      canCreate: permissions[feature.id]?.canCreate ?? false,
      canRead: permissions[feature.id]?.canRead ?? false,
      canUpdate: permissions[feature.id]?.canUpdate ?? false,
      canDelete: permissions[feature.id]?.canDelete ?? false,
      canPrint: permissions[feature.id]?.canPrint ?? false,
    }));

    createRoleMutation(
      {
        name: values.name,
        description: values.description || null,
        permissions: permissionsArray,
      },
      {
        onSuccess: () => {
          form.reset();
          setPermissions({});
          onOpenChange(false);
        },
      },
    );
  }

  function handleDialogClose(isOpen: boolean) {
    if (!isOpen) {
      form.reset();
      setPermissions({});
    }
    onOpenChange(isOpen);
  }

  // Extract server-side errors
  const serverError = error as {
    response?: {
      data?: { message?: string; issues?: { path: string; message: string }[] };
    };
  } | null;
  const serverMessage = serverError?.response?.data?.message;
  const serverIssues = serverError?.response?.data?.issues ?? [];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Create Role</DialogTitle>
          <DialogDescription>
            Define a new role with its name, description, and feature permissions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-role-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Global server error */}
            {serverMessage && (
              <p className="text-sm text-destructive">{serverMessage}</p>
            )}

            {/* ── Name & Description ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Editor" {...field} />
                    </FormControl>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'name') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'name')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'description') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'description')!.message}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* ── Permissions Table ── */}
            <div className="space-y-3">
              <h4 className="font-semibold text-base text-foreground">
                Permissions
              </h4>

              {isLoadingFeatures ? (
                <div className="flex justify-center items-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Loading features...</span>
                </div>
              ) : features.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No features available.
                </p>
              ) : (
                <div className="w-full overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border/50 hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-left text-muted-foreground font-medium">
                          Feature
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-muted-foreground font-medium">
                          All
                        </TableHead>
                        {OPERATIONS.map((op) => (
                          <TableHead
                              key={op}
                              className="px-4 py-3 text-center text-muted-foreground font-medium"
                          >
                            {OPERATION_LABELS[op]}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {features.map((feature) => (
                        <TableRow
                          key={feature.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="px-4 py-3 font-medium text-left">
                            {feature.name}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center !px-4">
                            <Checkbox
                              className="mx-auto"
                              checked={isAllChecked(feature.id)}
                              indeterminate={isSomeChecked(feature.id)}
                              onCheckedChange={() => toggleSelectAll(feature.id)}
                              aria-label={`Select all permissions for ${feature.name}`}
                            />
                          </TableCell>
                          {OPERATIONS.map((op) => (
                            <TableCell key={op} className="px-4 py-3 text-center !px-4">
                              <Checkbox
                                className="mx-auto"
                                checked={permissions[feature.id]?.[op] ?? false}
                                onCheckedChange={() =>
                                  togglePermission(feature.id, op)
                                }
                                aria-label={`${OPERATION_LABELS[op]} permission for ${feature.name}`}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDialogClose(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-role-form"
            disabled={isPending || isLoadingFeatures}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
