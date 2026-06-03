import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { authService } from '@/features/auth/auth-service';

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: { retry: false },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: authService.getState(),
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{ queryClient, auth: authService.getState() }}
      />
    </QueryClientProvider>
  </StrictMode>,
);

