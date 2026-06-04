import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { useRoleOptions } from '@/features/roles/hooks/use-role-options';
import { useCreateUser } from '../hooks/use-create-user';
import { CreateUserSchema, type CreateUserPayload } from '../types';

interface CreateUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserForm({ open, onOpenChange }: CreateUserFormProps) {
  const { mutate: createUser, isPending, error } = useCreateUser();
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleOptions({ limit: 100 });
  const roles = rolesData?.data ?? [];

  const form = useForm<CreateUserPayload>({
    resolver: typeboxResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      roleId: '',
      isActive: true,
    },
  });

  function handleSubmit(values: CreateUserPayload) {
    createUser(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  // Extract server-side field errors from 400 / 409 responses
  const serverError = error as {
    response?: { data?: { message?: string; issues?: { path: string; message: string }[] } };
  } | null;
  const serverMessage = serverError?.response?.data?.message;
  const serverIssues = serverError?.response?.data?.issues ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new user account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="create-user-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Global server error (e.g. 409 conflict message) */}
            {serverMessage && (
              <p className="text-sm text-destructive">{serverMessage}</p>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                  {serverIssues.find((i) => i.path === 'email') && (
                    <p className="text-sm text-destructive">
                      {serverIssues.find((i) => i.path === 'email')!.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Min. 8 characters" {...field} />
                  </FormControl>
                  <FormMessage />
                  {serverIssues.find((i) => i.path === 'password') && (
                    <p className="text-sm text-destructive">
                      {serverIssues.find((i) => i.path === 'password')!.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => {
                const selectedRole = roles.find((r) => r.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingRoles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={isLoadingRoles ? 'Loading roles…' : 'Select a role'}
                          >
                            {selectedRole ? selectedRole.name : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {serverIssues.find((i) => i.path === 'roleId') && (
                      <p className="text-sm text-destructive">
                        {serverIssues.find((i) => i.path === 'roleId')!.message}
                      </p>
                    )}
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="mb-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onOpenChange(false);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" form="create-user-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

