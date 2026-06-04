import { useEffect } from 'react';
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
import { useUserById } from '../hooks/use-user-by-id';
import { useEditUser } from '../hooks/use-edit-user';
import { EditUserSchema, type EditUserPayload } from '../types';

interface EditUserFormProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function EditUserForm({ userId, onOpenChange }: EditUserFormProps) {
  const open = userId !== null;
  const { data: userData, isLoading: isLoadingUser } = useUserById(userId);
  const { mutate: editUser, isPending, error } = useEditUser(userId ?? '');
  const { data: rolesData, isLoading: isLoadingRoles } = useRoleOptions({ limit: 100 });
  const roles = rolesData?.data ?? [];

  const form = useForm<EditUserPayload>({
    resolver: typeboxResolver(EditUserSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      roleId: '',
      isActive: true,
    },
  });

  // Pre-fill form when user data loads
  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      form.reset({
        email: user.email,
        name: user.name,
        password: '',
        roleId: user.roleId,
        isActive: user.isActive,
      });
    }
  }, [userData, form]);

  function handleSubmit(values: EditUserPayload) {
    // Only send password if user filled it in
    const payload: EditUserPayload = { ...values };
    if (!payload.password) {
      delete payload.password;
    }

    editUser(payload, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset();
    }
    onOpenChange(nextOpen);
  }

  // Extract server-side field errors from 400 responses
  const serverError = error as {
    response?: { data?: { message?: string; issues?: { path: string; message: string }[] } };
  } | null;
  const serverMessage = serverError?.response?.data?.message;
  const serverIssues = serverError?.response?.data?.issues ?? [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-sm border shadow-sm bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user's details. Leave password blank to keep the current password.
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form
              id="edit-user-form"
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
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
                      <Input
                        type="password"
                        placeholder="Leave blank to keep current password"
                        {...field}
                      />
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
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={isPending || isLoadingUser}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
