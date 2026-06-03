import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/rbac')({
  component: RbacPage,
});

function RbacPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">RBAC Management</h1>
      <p className="text-muted-foreground">Future feature implementation goes here.</p>
    </div>
  );
}
