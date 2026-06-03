# HttpOnly Cookie Refresh Token Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the refresh token from `sessionStorage` (client-managed) to an `HttpOnly` cookie (server-managed) so that JavaScript can never access the refresh token — eliminating XSS token theft entirely.

**Architecture:**
- The **backend** now sets the refresh token via `Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/auth` on login and refresh responses. The refresh token is **no longer included in the JSON response body**.
- The **frontend** never reads, stores, or sends the refresh token. It simply sets `withCredentials: true` on the Axios instance so the browser automatically attaches the cookie to `/auth/*` requests.
- `AuthService` is simplified: no `sessionStorage` for refresh tokens, no `getRefreshToken()`. The `init()` method becomes a simple `POST /auth/refresh` with no body — the browser sends the cookie automatically.
- The 401 interceptor is simplified: it no longer checks for a stored refresh token — it just attempts `POST /auth/refresh` (the cookie is sent automatically).

**Tech Stack:** TanStack Router v1, TanStack Query v5, Axios v1, React 19, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/features/auth/types.ts` | Remove `refresh_token` from `LoginResponseData`; remove `RefreshRequest` interface; update `RefreshResponse` |
| **Modify** | `src/features/auth/api.ts` | Simplify `refreshApi` — no request body; add `logoutApi` |
| **Modify** | `src/features/auth/auth-service.ts` | Remove all `sessionStorage` refresh token logic; simplify `init()` to take no arguments |
| **Modify** | `src/api/client.ts` | Add `withCredentials: true`; simplify 401 interceptor (no refresh token check) |
| **Modify** | `src/main.tsx` | Simplify `bootstrap()` — `init()` no longer needs `refreshApi` injected |
| **Modify** | `src/features/auth/hooks/use-login.ts` | No changes needed — `setSession` API stays the same ✅ |

---

## Task 1: Update Types — Remove `refresh_token` from Response Body

**Files:**
- Modify: `src/features/auth/types.ts`

The backend no longer returns `refresh_token` in the JSON body (it's in the `Set-Cookie` header now). We need to update the types to reflect this. We also remove `RefreshRequest` since the frontend no longer sends a refresh token in the request body.

- [ ] **Step 1: Replace the entire `src/features/auth/types.ts`**

  ```ts
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface AuthUser {
    id: string;
    email: string;
    name: string;
  }

  export interface LoginResponseData {
    access_token: string;
    user: AuthUser;
  }

  export interface ApiResponse<T> {
    error: boolean;
    code: number;
    message: string;
    data: T;
  }

  export type LoginResponse = ApiResponse<LoginResponseData>;

  export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    accessToken: string | null;
  }

  export type RefreshResponse = ApiResponse<LoginResponseData>;
  ```

  > **Key changes:** `LoginResponseData.refresh_token` removed. `RefreshRequest` interface removed entirely. `RefreshResponse` stays (same shape as `LoginResponse` now).

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: errors in `auth-service.ts` and `client.ts` referencing `refresh_token` and `RefreshRequest` — these will be fixed in subsequent tasks. As long as only those files error, this is fine.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/types.ts
  git commit -m "feat(auth): remove refresh_token from LoginResponseData and drop RefreshRequest type"
  ```

---

## Task 2: Simplify `refreshApi` and Add `logoutApi`

**Files:**
- Modify: `src/features/auth/api.ts`

`refreshApi` no longer sends a body — the refresh token is in the `HttpOnly` cookie, sent automatically by the browser. We also add a `logoutApi` that tells the backend to clear the cookie.

- [ ] **Step 1: Replace the entire `src/features/auth/api.ts`**

  ```ts
  import { api } from '@/api/client';
  import type { LoginRequest, LoginResponse, RefreshResponse } from './types';

  export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  export async function refreshApi(): Promise<RefreshResponse> {
    // No body needed — the HttpOnly cookie is sent automatically by the browser
    const response = await api.post<RefreshResponse>('/auth/refresh');
    return response.data;
  }

  export async function logoutApi(): Promise<void> {
    // Tells the backend to clear the refresh_token cookie
    await api.post('/auth/logout');
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: errors may remain in `auth-service.ts` (references to `RefreshRequest`, `sessionStorage`). These are fixed in Task 3.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/api.ts
  git commit -m "feat(auth): simplify refreshApi to use HttpOnly cookie; add logoutApi"
  ```

---

## Task 3: Migrate `AuthService` — Remove `sessionStorage` Refresh Token

**Files:**
- Modify: `src/features/auth/auth-service.ts`

The refresh token is no longer managed client-side. `AuthService` only stores the access token (in-memory) and the user (in `sessionStorage`). The `init()` method now takes no arguments — it directly calls the refresh endpoint.

- [ ] **Step 1: Replace the entire `src/features/auth/auth-service.ts`**

  ```ts
  import type { AuthUser, LoginResponseData, AuthState } from './types';

  const USER_KEY = 'auth_user';

  export class AuthService {
    // Access token lives in memory only — never touches Web Storage
    private _accessToken: string | null = null;

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

    // ─── Session Lifecycle ───────────────────────────────────────────────────────

    setSession(data: LoginResponseData): void {
      // Access token stored in-memory only
      this._accessToken = data.access_token;
      // User metadata stored in sessionStorage for display purposes
      sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }

    clearSession(): void {
      this._accessToken = null;
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

  > **Key changes:**
  > - Removed `REFRESH_TOKEN_KEY` constant and all `sessionStorage` operations for the refresh token
  > - Removed `getRefreshToken()` method entirely
  > - `setSession()` no longer writes `refresh_token` to storage (the backend handles it via cookie)
  > - `init()` signature simplified: `refreshFn` takes no arguments (cookie is automatic)
  > - `USER_KEY` stays in `sessionStorage` for quick user display (not security-sensitive)

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: errors may remain in `client.ts` (references `authService.getRefreshToken()`). Fixed in Task 4.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/auth-service.ts
  git commit -m "feat(auth): remove sessionStorage refresh token; rely on HttpOnly cookie"
  ```

---

## Task 4: Update Axios Client — `withCredentials` + Simplify 401 Interceptor

**Files:**
- Modify: `src/api/client.ts`

The Axios instance needs `withCredentials: true` so the browser sends the `HttpOnly` cookie on every request. The 401 interceptor no longer checks for a stored refresh token — it just attempts `POST /auth/refresh` and lets the cookie do the work.

- [ ] **Step 1: Replace the entire `src/api/client.ts`**

  ```ts
  import axios from 'axios';
  import { authService } from '@/features/auth/auth-service';

  // Create base instance — withCredentials ensures the HttpOnly cookie is sent
  export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
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
  // On 401: attempt one silent token refresh via cookie, then retry.
  // If refresh also fails: clear session and reject.

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
        // No body needed — the HttpOnly cookie is sent automatically
        const response = await api.post<{
          data: { access_token: string; user: import('@/features/auth/types').AuthUser };
        }>('/auth/refresh');

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

  > **Key changes:**
  > - Added `withCredentials: true` to `axios.create()` config
  > - Removed `authService.getRefreshToken()` check — the browser handles the cookie
  > - `api.post('/auth/refresh')` sends no body (cookie is automatic)
  > - Response type no longer includes `refresh_token`

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/api/client.ts
  git commit -m "feat(api): add withCredentials for HttpOnly cookie; simplify 401 interceptor"
  ```

---

## Task 5: Simplify `main.tsx` Bootstrap

**Files:**
- Modify: `src/main.tsx`

The `refreshApi` import is still needed but its signature changed (no arguments). Update the `bootstrap()` call accordingly.

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
    // Silently attempt to restore the session from the HttpOnly cookie.
    // The browser sends the refresh_token cookie automatically — no token
    // is read from storage. This runs before React mounts so the router
    // context starts with correct auth state.
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

  > The code looks nearly identical to before, but `refreshApi` now takes no arguments, which matches the new `init()` signature: `refreshFn: () => Promise<{ data: LoginResponseData }>`.

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/main.tsx
  git commit -m "feat(auth): update bootstrap to use cookie-based refreshApi"
  ```

---

## Task 6: Verify No Stale `sessionStorage` Refresh Token References

- [ ] **Step 1: Search for stale `refresh_token` references in sessionStorage usage**

  ```bash
  grep -rn "refresh_token" src/
  ```

  Expected: **no matches**. The string `refresh_token` should not appear anywhere in the frontend codebase — it's entirely server-managed now.

- [ ] **Step 2: Search for stale `sessionStorage` usage related to auth**

  ```bash
  grep -rn "sessionStorage" src/
  ```

  Expected: only `auth_user` key in `src/features/auth/auth-service.ts` (for user display metadata). No `refresh_token` references.

- [ ] **Step 3: Search for stale `RefreshRequest` references**

  ```bash
  grep -rn "RefreshRequest" src/
  ```

  Expected: **no matches**. This type was removed in Task 1.

- [ ] **Step 4: Commit cleanup (if any stale references found)**

  If any stale references are found, fix them and commit:

  ```bash
  git add -A
  git commit -m "fix(auth): remove stale refresh_token and RefreshRequest references"
  ```

  If no stale references exist, no commit is needed.

---

## Self-Review Checklist

- [x] **`refresh_token` never touched by JavaScript** — it's in an `HttpOnly` cookie set by the backend ✅ Tasks 1-4
- [x] **`access_token` still in-memory only** — unchanged from previous plan ✅
- [x] **`withCredentials: true`** on Axios instance — ensures cookie is sent with every request ✅ Task 4
- [x] **`RefreshRequest` type removed** — no longer needed ✅ Task 1
- [x] **`LoginResponseData` no longer has `refresh_token`** — matches new backend response shape ✅ Task 1
- [x] **`refreshApi` sends no body** — cookie-based ✅ Task 2
- [x] **`logoutApi` added** — calls `POST /auth/logout` to clear the cookie server-side ✅ Task 2
- [x] **`AuthService.init()` simplified** — no injected refresh token, just calls the endpoint ✅ Task 3
- [x] **401 interceptor simplified** — no `getRefreshToken()` check, just attempts refresh ✅ Task 4
- [x] **No stale references** — verified in Task 6 ✅
- [x] **No new dependencies** — only configuration changes ✅
- [x] **Type consistency** — all types, method signatures, and property names are consistent across tasks ✅
