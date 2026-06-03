# Fix Login Redirect (v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two separate bugs that together keep the user stuck on `/login` even after a successful login or when returning with a valid `refresh_token` cookie.

**Architecture:**

Two independent bugs need to be fixed:

1. **`InnerApp` doesn't re-render on auth change** — `router.invalidate()` re-runs `beforeLoad` inside the router, but `InnerApp` itself never re-renders because nothing triggers a React state update in it. The `context` prop passed to `RouterProvider` is therefore stale. Fix: give `AuthService` an observable subscription system so `InnerApp` can subscribe to auth state changes and call `setState` to force a re-render with fresh context.

2. **`redirect` search param is a full URL, not a pathname** — `_authenticated.tsx` sets `search: { redirect: location.href }` (e.g. `http://localhost:5173/`), and `use-login.ts` passes that full URL directly to `router.navigate({ to: ... })`. TanStack Router's `to` expects an **internal pathname** (e.g. `/`). Fix: change `_authenticated.tsx` to pass `location.pathname` and update `use-login.ts` to use the router-native `search` params via `useSearch` (typed) rather than `window.location.search`.

**Tech Stack:** TanStack Router v1, TanStack Query v5, React 19, TypeScript, Axios v1

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/features/auth/auth-service.ts` | Add subscriber/listener pattern so components can react to auth state changes |
| **Modify** | `src/main.tsx` | Subscribe `InnerApp` to auth state via `useState` + `useEffect` |
| **Modify** | `src/routes/_authenticated.tsx` | Pass `location.pathname` (not `location.href`) as redirect search param |
| **Modify** | `src/routes/login.tsx` | Declare `validateSearch` so the `redirect` param is typed and accessible |
| **Modify** | `src/features/auth/hooks/use-login.ts` | Read typed `redirect` search param via `useSearch`; navigate to pathname only |

---

## Task 1: Add Subscriber Pattern to `AuthService`

**Files:**
- Modify: `src/features/auth/auth-service.ts`

The `InnerApp` component needs to know when auth state changes so it can re-render and pass fresh context to `RouterProvider`. The cleanest way without adding a dependency is a simple listener/subscriber pattern on `AuthService`.

- [ ] **Step 1: Replace the entire `src/features/auth/auth-service.ts`**

  ```ts
  import type { AuthUser, LoginResponseData, AuthState } from './types';

  const USER_KEY = 'auth_user';

  type AuthStateListener = (state: AuthState) => void;

  export class AuthService {
    // Access token lives in memory only — never touches Web Storage
    private _accessToken: string | null = null;

    // Subscribers that want to be notified when auth state changes
    private _listeners: Set<AuthStateListener> = new Set();

    // ─── Getters ────────────────────────────────────────────────────────────────

    getAccessToken(): string | null {
      return this._accessToken;
    }

    getUser(): AuthUser | null {
      const raw = sessionStorage.getItem(USER_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as AuthUser;
      } catch {
        return null;
      }
    }

    isAuthenticated(): boolean {
      return this._accessToken !== null;
    }

    // ─── Subscriptions ───────────────────────────────────────────────────────────

    /**
     * Subscribe to auth state changes.
     * Returns an unsubscribe function — call it in useEffect cleanup.
     */
    subscribe(listener: AuthStateListener): () => void {
      this._listeners.add(listener);
      return () => this._listeners.delete(listener);
    }

    private _notify(): void {
      const state = this.getState();
      this._listeners.forEach((listener) => listener(state));
    }

    // ─── Session Lifecycle ───────────────────────────────────────────────────────

    setSession(data: LoginResponseData): void {
      // Access token stored in-memory only
      this._accessToken = data.access_token;
      // User metadata stored in sessionStorage for display purposes
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
      this._notify();
    }

    clearSession(): void {
      this._accessToken = null;
      sessionStorage.removeItem(USER_KEY);
      this._notify();
    }

    getState(): AuthState {
      return {
        isAuthenticated: this.isAuthenticated(),
        user: this.getUser(),
        accessToken: this._accessToken,
      };
    }

    // ─── Initialisation (call once on app startup) ───────────────────────────────

    /**
     * Attempts to silently restore a session by calling the refresh endpoint.
     * The browser sends the HttpOnly refresh_token cookie automatically.
     * Call this before mounting the React app.
     *
     * @param refreshFn - Function that calls POST /auth/refresh (no body needed)
     * @returns true if session was restored, false otherwise
     */
    async init(
      refreshFn: () => Promise<{ data: LoginResponseData }>
    ): Promise<boolean> {
      try {
        const response = await refreshFn();
        this.setSession(response.data);
        return true;
      } catch {
        // No valid refresh cookie or expired — user must log in
        this.clearSession();
        return false;
      }
    }
  }

  // Singleton instance used across the app
  export const authService = new AuthService();
  ```

  > **Why:** Adding `subscribe` + `_notify` lets `InnerApp` hook into auth changes without pulling in Zustand or Context. `_notify` is called inside `setSession` and `clearSession`, which are the only two mutation points.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/auth-service.ts
  git commit -m "feat(auth): add subscriber pattern to AuthService for reactive auth state"
  ```

---

## Task 2: Make `InnerApp` Subscribe to Auth State

**Files:**
- Modify: `src/main.tsx`

`InnerApp` must call `useState` (seeded with the current auth state) and subscribe to `authService` changes via `useEffect`. When auth state changes, React re-renders `InnerApp` with fresh context, which `RouterProvider` receives and passes to `beforeLoad` guards.

- [ ] **Step 1: Replace the entire `src/main.tsx`**

  ```tsx
  import { StrictMode, useState, useEffect } from 'react';
  import { createRoot } from 'react-dom/client';
  import './index.css';
  import { RouterProvider, createRouter } from '@tanstack/react-router';
  import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
  import { routeTree } from './routeTree.gen';
  import { authService } from '@/features/auth/auth-service';
  import { refreshApi } from '@/features/auth/api';
  import type { AuthState } from '@/features/auth/types';

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
   * InnerApp subscribes to AuthService so it re-renders whenever auth state
   * changes (login, logout, silent refresh). On each re-render it passes the
   * latest auth state as context to RouterProvider, which makes beforeLoad
   * guards always see current auth state.
   */
  function InnerApp() {
    const [auth, setAuth] = useState<AuthState>(() => authService.getState());

    useEffect(() => {
      // Subscribe returns an unsubscribe function — React calls it on unmount
      return authService.subscribe(setAuth);
    }, []);

    return (
      <RouterProvider
        router={router}
        context={{ queryClient, auth }}
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
  ```

  > **Why this works:** `authService.subscribe(setAuth)` registers `setAuth` as a listener. When `authService.setSession()` is called (after login or silent refresh), `_notify()` fires, which calls `setAuth(newState)`. React schedules a re-render of `InnerApp` with the new `auth` state. `RouterProvider` receives the fresh `context`, and the next `beforeLoad` evaluation sees `isAuthenticated: true`.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/main.tsx
  git commit -m "fix(auth): subscribe InnerApp to AuthService for reactive router context"
  ```

---

## Task 3: Fix `redirect` Param to Use Pathname and Add Typed Search Params

**Files:**
- Modify: `src/routes/_authenticated.tsx`
- Modify: `src/routes/login.tsx`
- Modify: `src/features/auth/hooks/use-login.ts`

**Root cause of bug 2:** `_authenticated.tsx` passes `location.href` (full URL like `http://localhost:5173/`) as the `redirect` search param. `use-login.ts` reads it and passes it to `router.navigate({ to: ... })`. TanStack Router's `to` parameter expects an **internal pathname** (e.g. `/`), not a full URL — so navigation silently fails or is a no-op.

**Fix:**
1. `_authenticated.tsx` → pass `location.pathname` (e.g. `/dashboard`) instead of `location.href`
2. `login.tsx` → declare `validateSearch` so the `redirect` param is typed and accessible via `useSearch`
3. `use-login.ts` → read `redirect` via typed `useSearch` from the login route (not raw `window.location.search`)

- [ ] **Step 1: Replace the entire `src/routes/_authenticated.tsx`**

  ```tsx
  import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

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
    component: () => <Outlet />,
  });
  ```

- [ ] **Step 2: Replace the entire `src/routes/login.tsx`**

  ```tsx
  import { createFileRoute, redirect } from '@tanstack/react-router';
  import { LoginForm } from '@/features/auth/components/login-form';

  export const Route = createFileRoute('/login')({
    // Declare the search params this route accepts so useSearch() is typed
    validateSearch: (search: Record<string, unknown>) => ({
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    }),
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

- [ ] **Step 3: Replace the entire `src/features/auth/hooks/use-login.ts`**

  ```ts
  import { useMutation } from '@tanstack/react-query';
  import { useRouter, useSearch } from '@tanstack/react-router';
  import { loginApi } from '../api';
  import type { LoginRequest } from '../types';
  import { authService } from '../auth-service';

  export function useLogin() {
    const router = useRouter();
    // Typed search params from the /login route — redirect is a pathname string
    const { redirect } = useSearch({ from: '/login' });

    return useMutation({
      mutationFn: (credentials: LoginRequest) => loginApi(credentials),
      onSuccess: async (data) => {
        // Persist tokens and user — this triggers authService._notify(),
        // which calls setAuth in InnerApp, causing a re-render with fresh context
        authService.setSession(data.data);

        // Wait for the router to re-evaluate context with the fresh auth state
        await router.invalidate();

        // Navigate to the originally requested page, or home
        router.navigate({ to: redirect ?? '/' });
      },
      onError: (error) => {
        console.error('[useLogin] login failed:', error);
      },
    });
  }
  ```

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 5: Commit**

  ```bash
  git add src/routes/_authenticated.tsx src/routes/login.tsx src/features/auth/hooks/use-login.ts
  git commit -m "fix(auth): use pathname for redirect param; typed search via validateSearch"
  ```

---

## Self-Review Checklist

- [x] **Root cause 1 addressed** — `InnerApp` now subscribes to `authService` and re-renders with fresh auth state ✅ Tasks 1 & 2
- [x] **Root cause 2 addressed** — `redirect` param is now `location.pathname`, not `location.href` ✅ Task 3
- [x] **Typed search params** — `validateSearch` on `/login` route makes `redirect` fully typed and safe ✅ Task 3
- [x] **`router.invalidate()` still awaited** — retained from previous plan ✅ Task 3
- [x] **Subscriber cleanup** — `useEffect` returns the unsubscribe function; no memory leaks ✅ Task 2
- [x] **No new required dependencies** — zod is optional (alternative provided) ✅ Task 3
- [x] **Type consistency** — `AuthState`, `AuthStateListener`, `LoginResponseData` all match existing types ✅
- [x] **No placeholders** — every step has complete, copy-paste-ready code ✅
- [x] **Backward compatible** — `clearSession` still notifies, so logout will also trigger InnerApp re-render ✅
