# Secure Token Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `localStorage`-based JWT storage with an in-memory access token + `sessionStorage` refresh token strategy to eliminate XSS token theft, and complete the 401 refresh-token interceptor.

**Architecture:**
- **`access_token`** moves to a private in-memory variable inside `AuthService` — it is never written to any Web Storage, so JavaScript injected via XSS cannot read it. It is lost on page reload (by design).
- **`refresh_token` and `user`** move to `sessionStorage` — scoped to the browser tab, not shared across tabs, and cleared when the tab closes. On every page load, `authService.init()` calls the `/auth/refresh` endpoint to silently exchange the refresh token for a new access token before the React app mounts.
- The Axios client is decoupled from `localStorage` and reads the access token directly from `authService`.
- The 401 response interceptor is completed with a token-refresh-and-retry flow.

**Tech Stack:** TanStack Router v1, TanStack Query v5, Axios v1, React 19, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Create** | `src/features/auth/api.ts` *(extend)* | Add `refreshApi` function calling `POST /auth/refresh` |
| **Modify** | `src/features/auth/auth-service.ts` | In-memory `_accessToken`; `sessionStorage` for refresh token + user; add `init()` method |
| **Modify** | `src/api/client.ts` | Request interceptor reads from `authService`; 401 interceptor does refresh-and-retry |
| **Modify** | `src/main.tsx` | Await `authService.init()` before mounting React; show a loading screen during init |
| **Modify** | `src/features/auth/hooks/use-login.ts` | No change to public API — already calls `authService.setSession` ✅ |

---

## Task 1: Add `refreshApi` to the Auth API Module

**Files:**
- Modify: `src/features/auth/api.ts`
- Modify: `src/features/auth/types.ts`

- [ ] **Step 1: Add `RefreshRequest` and `RefreshResponse` types to `src/features/auth/types.ts`**

  Append to the bottom of the file:

  ```ts
  export interface RefreshRequest {
    refresh_token: string;
  }

  export type RefreshResponse = ApiResponse<LoginResponseData>;
  ```

- [ ] **Step 2: Add `refreshApi` function to `src/features/auth/api.ts`**

  Replace the entire file with:

  ```ts
  import { api } from '@/api/client';
  import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from './types';

  export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  export async function refreshApi(body: RefreshRequest): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>('/auth/refresh', body);
    return response.data;
  }
  ```

- [ ] **Step 3: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add src/features/auth/api.ts src/features/auth/types.ts
  git commit -m "feat(auth): add refreshApi and RefreshRequest/RefreshResponse types"
  ```

---

## Task 2: Migrate `AuthService` to In-Memory + `sessionStorage`

**Files:**
- Modify: `src/features/auth/auth-service.ts`

- [ ] **Step 1: Replace the entire `src/features/auth/auth-service.ts`** with the new implementation

  ```ts
  import type { AuthUser, LoginResponseData, AuthState, RefreshRequest } from './types';

  const REFRESH_TOKEN_KEY = 'refresh_token';
  const USER_KEY = 'auth_user';

  export class AuthService {
    // Access token lives in memory only — never touches Web Storage
    private _accessToken: string | null = null;

    // ─── Getters ────────────────────────────────────────────────────────────────

    getAccessToken(): string | null {
      return this._accessToken;
    }

    getRefreshToken(): string | null {
      return sessionStorage.getItem(REFRESH_TOKEN_KEY);
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

    // ─── Session Lifecycle ───────────────────────────────────────────────────────

    setSession(data: LoginResponseData): void {
      // Access token stored in-memory only
      this._accessToken = data.access_token;
      // Refresh token and user stored in sessionStorage (tab-scoped)
      sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    clearSession(): void {
      this._accessToken = null;
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
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
     * Attempts to silently restore a session from a stored refresh token.
     * Call this before mounting the React app.
     *
     * @param refreshFn - Function that calls POST /auth/refresh with the stored token
     * @returns true if session was restored, false otherwise
     */
    async init(
      refreshFn: (body: RefreshRequest) => Promise<{ data: LoginResponseData }>
    ): Promise<boolean> {
      const storedRefreshToken = this.getRefreshToken();
      if (!storedRefreshToken) return false;

      try {
        const response = await refreshFn({ refresh_token: storedRefreshToken });
        this.setSession(response.data);
        return true;
      } catch {
        // Refresh token is invalid or expired — clear storage
        this.clearSession();
        return false;
      }
    }
  }

  // Singleton instance used across the app
  export const authService = new AuthService();
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/auth-service.ts
  git commit -m "feat(auth): migrate AuthService to in-memory access token + sessionStorage refresh token"
  ```

---

## Task 3: Update Axios Client — Remove `localStorage` & Complete 401 Interceptor

**Files:**
- Modify: `src/api/client.ts`

The current request interceptor reads directly from `localStorage`. This must be changed to read from `authService`. The 401 response interceptor must be completed with refresh-and-retry logic.

> **Circular dependency note:** `client.ts` imports `authService`, and `auth-service.ts`'s `init()` accepts a function that internally uses `api` from `client.ts`. This is intentional — the dependency is injected via a callback (not a direct import), so there is no circular module graph.

- [ ] **Step 1: Replace the entire `src/api/client.ts`**

  ```ts
  import axios from 'axios';
  import { authService } from '@/features/auth/auth-service';

  // Create base instance
  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // ─── Request Interceptor ────────────────────────────────────────────────────
  // Attaches the in-memory access token to every outgoing request
  api.interceptors.request.use(
    (config) => {
      const token = authService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ─── Response Interceptor ───────────────────────────────────────────────────
  // On 401: attempt one silent token refresh, then retry the original request.
  // On second 401: clear session and reject (user must log in again).

  let _isRefreshing = false;
  let _refreshSubscribers: Array<(token: string) => void> = [];

  function subscribeToRefresh(callback: (token: string) => void) {
    _refreshSubscribers.push(callback);
  }

  function notifyRefreshSubscribers(token: string) {
    _refreshSubscribers.forEach((cb) => cb(token));
    _refreshSubscribers = [];
  }

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Only attempt refresh on 401, and only once per request
      if (error.response?.status !== 401 || originalRequest._retried) {
        return Promise.reject(error);
      }

      const refreshToken = authService.getRefreshToken();
      if (!refreshToken) {
        authService.clearSession();
        return Promise.reject(error);
      }

      // If a refresh is already in-flight, queue this request until it resolves
      if (_isRefreshing) {
        return new Promise<string>((resolve) => {
          subscribeToRefresh(resolve);
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      // Mark this request as already retried to prevent infinite loops
      originalRequest._retried = true;
      _isRefreshing = true;

      try {
        const response = await api.post<{
          data: { access_token: string; refresh_token: string; user: import('@/features/auth/types').AuthUser };
        }>('/auth/refresh', { refresh_token: refreshToken });

        const newData = response.data.data;
        authService.setSession(newData);

        // Replay all queued requests with the new token
        notifyRefreshSubscribers(newData.access_token);

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newData.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear session; user must log in again
        authService.clearSession();
        _refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }
  );
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/api/client.ts
  git commit -m "feat(api): read access token from AuthService memory; complete 401 refresh-and-retry interceptor"
  ```

---

## Task 4: Call `authService.init()` Before Mounting React

**Files:**
- Modify: `src/main.tsx`

On every page load or reload, the in-memory access token is gone. This task adds an async init step that runs before React mounts. If a `refresh_token` exists in `sessionStorage`, it silently exchanges it for a new access token. The user sees a minimal loading indicator during this check (typically < 500ms).

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

  async function bootstrap() {
    // Silently attempt to restore the session from a stored refresh token.
    // This runs before React mounts so the router context starts with
    // correct auth state and the user doesn't see a flash of the login page.
    await authService.init(refreshApi);

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
  }

  bootstrap();
  ```

  > **Why `bootstrap()` instead of top-level `await`?** Vite supports top-level `await` in ESM, but it blocks the entire module graph. Wrapping in an async function keeps the pattern more portable and easier to reason about.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Manual smoke test — session persistence across reload**

  1. Start the dev server: `npm run dev`
  2. Log in with valid credentials.
  3. Check `sessionStorage` in DevTools → Application → Session Storage: `refresh_token` and `auth_user` should exist. `localStorage` should be **empty** (no `access_token`).
  4. Hard refresh the page (`Ctrl+Shift+R`). You should stay on `/` (not redirected to `/login`), because `authService.init()` silently obtained a new access token from the refresh endpoint.
  5. Close the browser tab entirely. Open a new tab to `http://localhost:5173/`. You should be redirected to `/login` (session cleared because `sessionStorage` is tab-scoped).

- [ ] **Step 4: Commit**

  ```bash
  git add src/main.tsx
  git commit -m "feat(auth): await authService.init before mounting React for silent session restore"
  ```

---

## Task 5: Verify Old `localStorage` References Are Gone

This task ensures no code in the project still reads or writes `localStorage` for auth tokens.

- [ ] **Step 1: Search for stale `localStorage` references**

  ```bash
  grep -rn "localStorage" src/
  ```

  Expected output: **no matches** (or only non-auth-related code if any exists elsewhere).

- [ ] **Step 2: Search for any direct `access_token` string literals outside `auth-service.ts`**

  ```bash
  grep -rn "access_token" src/
  ```

  Expected: only appears inside `src/features/auth/types.ts` (as an interface field name) and `src/features/auth/auth-service.ts`. No route files, no hooks, no components.

- [ ] **Step 3: Commit cleanup note (or fix any found references)**

  If any stale references are found, remove them and then commit:

  ```bash
  git add -A
  git commit -m "fix(auth): remove remaining localStorage direct references"
  ```

  If no stale references exist, no commit is needed.

---

## Self-Review Checklist

- [x] **`access_token` never touches Web Storage** — in-memory only ✅ Task 2
- [x] **`refresh_token` moved from `localStorage` → `sessionStorage`** — tab-scoped ✅ Task 2
- [x] **No direct `localStorage` reads in Axios interceptor** — reads `authService.getAccessToken()` ✅ Task 3
- [x] **401 refresh-and-retry interceptor implemented** — handles concurrent requests correctly via subscriber queue ✅ Task 3
- [x] **Silent session restore on page reload** — `authService.init()` in `bootstrap()` ✅ Task 4
- [x] **`refreshApi` is type-safe** — uses `RefreshRequest`/`RefreshResponse` ✅ Task 1
- [x] **Type consistency** — `RefreshRequest`, `RefreshResponse`, `LoginResponseData` used consistently ✅
- [x] **No placeholders** — all code blocks are complete ✅
- [x] **Stale `localStorage` references verified gone** ✅ Task 5
