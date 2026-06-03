# Fix Post-Login Redirect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the bug where a successful login leaves the user stuck on `/login` instead of redirecting to the protected home page (`/`).

**Architecture:**
- **Root cause:** The `RouterProvider` receives `context.auth` as a static snapshot object at mount time. When `useLogin`'s `onSuccess` calls `authService.setSession()` + `router.invalidate()`, the router re-runs `beforeLoad` guards — but they still see the **stale** `isAuthenticated: false` from the original snapshot. The navigation to `/` triggers the `_authenticated` guard, which redirects back to `/login`.
- **Fix:** Wrap `RouterProvider` in an `InnerApp` React component that calls `authService.getState()` on every render. This means `router.invalidate()` triggers a re-render of `InnerApp`, which passes **fresh** auth state as the context prop. The `_authenticated` guard then sees `isAuthenticated: true` and allows navigation through.
- **Secondary fix:** The `useLogin` hook should `await router.invalidate()` before calling `router.navigate()` to ensure the context is fully refreshed before the navigation attempt.

**Tech Stack:** TanStack Router v1, TanStack Query v5, Axios v1, React 19, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/main.tsx` | Extract `InnerApp` component that provides reactive auth context to `RouterProvider` |
| **Modify** | `src/features/auth/hooks/use-login.ts` | `await router.invalidate()` before navigating; use `redirect` search param if available |

---

## Task 1: Make Router Context Reactive via `InnerApp` Component

**Files:**
- Modify: `src/main.tsx`

The current code passes `auth: authService.getState()` as a static object to `RouterProvider`. This snapshot is captured once and never updates. The fix is to create an `InnerApp` component that reads fresh auth state on every render.

- [ ] **Step 1: Replace the entire `src/main.tsx`**

  ```tsx
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
  ```

  > **Why this works:** `router.invalidate()` causes `RouterProvider` to trigger a re-render of its parent (`InnerApp`). On re-render, `authService.getState()` is called again, returning the **fresh** state with `isAuthenticated: true`. The `beforeLoad` guards now see the updated context.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/main.tsx
  git commit -m "fix(auth): make router context reactive via InnerApp component"
  ```

---

## Task 2: Await `router.invalidate()` Before Navigating in `useLogin`

**Files:**
- Modify: `src/features/auth/hooks/use-login.ts`

Currently `router.invalidate()` and `router.navigate()` are called back-to-back synchronously. `invalidate()` returns a Promise — we need to `await` it so the context is fully refreshed before the navigation triggers `beforeLoad` guards. We also add support for the `redirect` search param that the `_authenticated` guard sets.

- [ ] **Step 1: Replace the entire `src/features/auth/hooks/use-login.ts`**

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
      onSuccess: async (data) => {
        // Persist tokens and user via AuthService
        authService.setSession(data.data);

        // Wait for the router to re-evaluate context with fresh auth state.
        // This ensures beforeLoad guards see isAuthenticated: true.
        await router.invalidate();

        // Navigate to the originally requested page, or home
        const search = new URLSearchParams(window.location.search);
        const redirectTo = search.get('redirect') || '/';
        router.navigate({ to: redirectTo });
      },
      onError: (error) => {
        console.error('[useLogin] login failed:', error);
      },
    });
  }
  ```

  > **Key changes:**
  > 1. `onSuccess` is now `async` and `await`s `router.invalidate()` before navigating
  > 2. Reads the `redirect` search param (set by `_authenticated` guard) to return the user to their originally requested page

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/hooks/use-login.ts
  git commit -m "fix(auth): await router.invalidate before navigating; honor redirect search param"
  ```

---

## Self-Review Checklist

- [x] **Root cause addressed** — Router context is now reactive via `InnerApp` re-render ✅ Task 1
- [x] **`router.invalidate()` awaited** — context is guaranteed fresh before navigation ✅ Task 2
- [x] **Redirect search param honored** — user returns to their originally requested page ✅ Task 2
- [x] **No new dependencies** — only structural changes ✅
- [x] **Type consistency** — all signatures match existing types ✅
- [x] **No placeholders** — all code blocks are complete ✅
- [x] **Backward compatible** — login guard in `_authenticated.tsx` and `login.tsx` remain unchanged ✅
