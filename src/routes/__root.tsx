import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { AuthState } from '@/features/auth/types';

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthState;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
    </div>
  ),
});

