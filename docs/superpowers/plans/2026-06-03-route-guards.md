# Route Guards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Protect all non-public routes so unauthenticated users are redirected to `/login`, and already-authenticated users visiting `/login` are sent to `/`.

**Architecture:** Use TanStack Router's `createRootRouteWithContext` to inject an `AuthService` into the router context. A pathless layout route `_authenticated` wraps all protected routes and uses `beforeLoad` to redirect to `/login` when the user is not authenticated. The login route uses its own `beforeLoad` to redirect authenticated users away. The `AuthService` is the single source of truth for token reads/writes.

**Tech Stack:** TanStack Router v1, TanStack Query v5, React 19, TypeScript, Axios (existing), `localStorage` for token storage (existing behaviour — not changed in this plan)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Create** | `src/features/auth/auth-service.ts` | Reads/writes tokens & user from `localStorage`; exposes `getUser`, `isAuthenticated`, `setSession`, `clearSession` |
| **Extend** | `src/features/auth/types.ts` | Add `AuthState` type |
| **Modify** | `src/routes/__root.tsx` | Switch to `createRootRouteWithContext<RouterContext>`, pass `auth` to context |
| **Create** | `src/routes/_authenticated.tsx` | Pathless layout route — `beforeLoad` redirect guard |
| **Create** | `src/routes/_authenticated/index.tsx` | Move home page under the protected layout |
| **Delete** | `src/routes/index.tsx` | Replaced by `_authenticated/index.tsx` |
| **Modify** | `src/routes/login.tsx` | Add `beforeLoad` to redirect authenticated users to `/` |
| **Modify** | `src/features/auth/hooks/use-login.ts` | Call `authService.setSession()` instead of raw `localStorage.setItem` |
| **Modify** | `src/main.tsx` | Create `authService`, pass it as router context |

---

## Task 1: Create `AuthService`

**Files:**
- Create: `src/features/auth/auth-service.ts`
- Modify: `src/features/auth/types.ts`

- [ ] **Step 1: Add `AuthState` type to `src/features/auth/types.ts`**

  Open `src/features/auth/types.ts` and append at the bottom:

  ```ts
  export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    accessToken: string | null;
  }
  ```

- [ ] **Step 2: Create `src/features/auth/auth-service.ts`**

  ```ts
  import type { AuthUser, LoginResponseData, AuthState } from './types';

  const ACCESS_TOKEN_KEY = 'access_token';
  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'auth_user';

  export class AuthService {
    getAccessToken(): string | null {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    getUser(): AuthUser | null {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        return null;
      }
    }

    isAuthenticated(): boolean {
      return !!this.getAccessToken();
    }

    setSession(data: LoginResponseData): void {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    clearSession(): void {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    getState(): AuthState {
      return {
        isAuthenticated: this.isAuthenticated(),
        user: this.getUser(),
        accessToken: this.getAccessToken(),
      };
    }
  }

  // Singleton instance used across the app
  export const authService = new AuthService();
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors related to `auth-service.ts` or `types.ts`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/features/auth/auth-service.ts src/features/auth/types.ts
  git commit -m "feat(auth): add AuthService singleton for token/session management"
  ```

---

## Task 2: Wire Router Context

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Update `src/routes/__root.tsx`** to use `createRootRouteWithContext`

  Replace the entire file with:

  ```tsx
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
  ```

- [ ] **Step 2: Update `src/main.tsx`** to provide context to the router

  Replace the entire file with:

  ```tsx
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
  ```

  > **Why pass `context` to both `createRouter` and `RouterProvider`?**
  > `createRouter` needs a static initial value for type inference. `RouterProvider`'s `context` prop refreshes the auth state on every navigation (re-render), so the guard always sees current `localStorage` values.

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/routes/__root.tsx src/main.tsx
  git commit -m "feat(router): wire RouterContext with queryClient and auth state"
  ```

---

## Task 3: Create the `_authenticated` Layout Route (Guard)

**Files:**
- Create: `src/routes/_authenticated.tsx`

- [ ] **Step 1: Create `src/routes/_authenticated.tsx`**

  ```tsx
  import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

  export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context, location }) => {
      if (!context.auth.isAuthenticated) {
        throw redirect({
          to: '/login',
          search: {
            redirect: location.href,
          },
        });
      }
    },
    component: () => <Outlet />,
  });
  ```

  > **How this works:** TanStack Router's pathless route `_authenticated` (underscore prefix) groups child routes without adding a URL segment. Every route nested under it runs `beforeLoad` first — if the user is not authenticated, they're redirected to `/login` with the original URL saved in the `redirect` search param for post-login restoration.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors. The router plugin will auto-generate the updated `routeTree.gen.ts` on the next `vite` run.

- [ ] **Step 3: Commit**

  ```bash
  git add src/routes/_authenticated.tsx
  git commit -m "feat(router): add _authenticated pathless layout route with beforeLoad guard"
  ```

---

## Task 4: Move the Home Route Under `_authenticated`

**Files:**
- Create: `src/routes/_authenticated/index.tsx`
- Delete: `src/routes/index.tsx`

- [ ] **Step 1: Create the directory and new index route**

  ```bash
  mkdir -p src/routes/_authenticated
  ```

  Create `src/routes/_authenticated/index.tsx`:

  ```tsx
  import { createFileRoute, Link } from '@tanstack/react-router';
  import { buttonVariants } from '@/components/ui/button';
  import { LogIn } from 'lucide-react';

  export const Route = createFileRoute('/_authenticated/')({
    component: Index,
  });

  function Index() {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome to TanStack Auth Starter
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            A secure, high-performance starter template equipped with TanStack Router, TanStack Query, and Tailwind CSS.
          </p>
        </div>

        <Link
          to="/login"
          className={buttonVariants({ variant: 'default', size: 'default' })}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Go to Login Page
        </Link>
      </div>
    );
  }
  ```

- [ ] **Step 2: Delete the old unprotected index route**

  ```bash
  rm src/routes/index.tsx
  ```

- [ ] **Step 3: Run the dev server to let the router plugin regenerate `routeTree.gen.ts`**

  ```bash
  npm run dev
  ```

  Check the terminal — `routeTree.gen.ts` should regenerate automatically. Stop the server with `Ctrl+C` after it compiles.

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 5: Manually test the guard**

  1. Open the browser at `http://localhost:5173/`.
  2. Confirm you are redirected to `/login?redirect=%2F` when no token is in `localStorage`.
  3. Set a fake token in the browser console: `localStorage.setItem('access_token', 'fake')`.
  4. Navigate to `/` — confirm you see the home page (no redirect).
  5. Remove the token: `localStorage.removeItem('access_token')`.

- [ ] **Step 6: Commit**

  ```bash
  git add src/routes/_authenticated/index.tsx
  git rm src/routes/index.tsx
  git commit -m "feat(router): move home route under _authenticated layout guard"
  ```

---

## Task 5: Guard the Login Route (Redirect Authenticated Users)

**Files:**
- Modify: `src/routes/login.tsx`

- [ ] **Step 1: Update `src/routes/login.tsx`** with a `beforeLoad` redirect for authenticated users

  Replace the entire file with:

  ```tsx
  import { createFileRoute, redirect } from '@tanstack/react-router';
  import { LoginForm } from '@/features/auth/components/login-form';

  export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
        throw redirect({ to: '/' });
      }
    },
    component: LoginPage,
  });

  function LoginPage() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Manually test**

  1. Set a fake token: `localStorage.setItem('access_token', 'fake')`.
  2. Navigate to `http://localhost:5173/login`.
  3. Confirm you are immediately redirected to `/`.
  4. Clear the token: `localStorage.removeItem('access_token')`.
  5. Navigate to `/login` — confirm the form is shown normally.

- [ ] **Step 4: Commit**

  ```bash
  git add src/routes/login.tsx
  git commit -m "feat(router): redirect authenticated users away from /login"
  ```

---

## Task 6: Use `AuthService` in `useLogin` Hook

**Files:**
- Modify: `src/features/auth/hooks/use-login.ts`

This task replaces the raw `localStorage.setItem` calls with `authService.setSession()` so token storage is centralised and the router context is refreshed after login.

- [ ] **Step 1: Update `src/features/auth/hooks/use-login.ts`**

  Replace the entire file with:

  ```ts
  import { useMutation } from '@tanstack/react-query';
  import { useRouter } from '@tanstack/react-router';
  import { loginApi } from '../api';
  import type { LoginRequest } from '../types';
  import { authService } from '../auth-service';

  export function useLogin() {
    const router = useRouter();

    return useMutation({
      mutationFn: (credentials: LoginRequest) => loginApi(credentials),
      onSuccess: (data) => {
        // Persist tokens and user via AuthService
        authService.setSession(data.data);

        // Invalidate the router so context.auth is refreshed on next navigation
        router.invalidate();

        // Navigate to home page after successful login
        router.navigate({ to: '/' });
      },
      onError: (error) => {
        console.error('[useLogin] login failed:', error);
      },
    });
  }
  ```

  > **Why `router.invalidate()`?** The router context is set at startup from `authService.getState()`. After login, `localStorage` has changed but the router context hasn't re-read it. `router.invalidate()` forces the router to re-run `beforeLoad` hooks with a fresh context, so `/` no longer redirects to `/login`.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Full end-to-end manual test**

  1. Clear all storage: `localStorage.clear()`.
  2. Navigate to `http://localhost:5173/` — should redirect to `/login?redirect=%2F`.
  3. Submit the login form with valid credentials.
  4. Should navigate to `/` after successful login.
  5. Check `localStorage` — `access_token`, `refresh_token`, and `auth_user` keys should all be set.
  6. Refresh the page at `/` — should remain on `/` (no redirect loop).
  7. Manually clear the token: `localStorage.removeItem('access_token')` then refresh — should redirect to `/login`.

- [ ] **Step 4: Commit**

  ```bash
  git add src/features/auth/hooks/use-login.ts
  git commit -m "feat(auth): use AuthService.setSession in useLogin and invalidate router context"
  ```

---

## Self-Review Checklist

- [x] **Unauthenticated `/`** → redirected to `/login` ✅ Task 3 + 4
- [x] **Unauthenticated `/login`** → login page shown ✅ Task 5
- [x] **Authenticated `/login`** → redirected to `/` ✅ Task 5
- [x] **Authenticated `/`** → home page shown ✅ Task 3 + 4
- [x] **Post-login navigation** → context refreshed via `router.invalidate()` ✅ Task 6
- [x] **Token storage centralised** → `AuthService.setSession` / `clearSession` ✅ Task 1 + 6
- [x] **Type consistency** — `AuthState`, `RouterContext`, `authService` names consistent across all tasks ✅
- [x] **No placeholders** — all code blocks are complete ✅
