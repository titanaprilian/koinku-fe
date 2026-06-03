import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { authService } from '@/features/auth/auth-service';
import { refreshApi } from '@/features/auth/api';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // Placeholder — real auth state is injected via RouterProvider context prop
    auth: authService.getState(),
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * InnerApp reads fresh auth state on every render.
 * When router.invalidate() is called (e.g. after login), React re-renders
 * this component, which passes the updated auth context to RouterProvider.
 * This ensures beforeLoad guards always see current auth state.
 */
function InnerApp() {
  return (
    <RouterProvider
      router={router}
      context={{ queryClient, auth: authService.getState() }}
    />
  );
}

async function bootstrap() {
  // Silently attempt to restore the session from the HttpOnly cookie.
  // The browser sends the refresh_token cookie automatically — no token
  // is read from storage. This runs before React mounts so the router
  // context starts with correct auth state.
  await authService.init(refreshApi);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </StrictMode>,
  );
}

bootstrap();
