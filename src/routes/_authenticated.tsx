import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppLayout } from '@/components/layout/app-layout';
import { RbacProvider } from '@/features/roles/components/rbac-provider';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          // Use pathname only — router.navigate({ to }) expects a route path
          redirect: location.pathname,
        },
      });
    }
  },
  component: () => (
    <RbacProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </RbacProvider>
  ),
});

