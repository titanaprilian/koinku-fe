# Handle 401 Token Revoked and Cookie Deletion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Handle 401 "Token has been revoked" errors gracefully by clearing the local session, making a POST request to `/auth/logout` with empty tokens (which instructs the backend to delete the HttpOnly refresh token cookie), and redirecting the user to the `/login` page instead of displaying a blank white page.

**Architecture:**
- **Axios Interceptor (`src/api/client.ts`):** 
  1. If `/auth/refresh` itself fails with a `401` status (meaning the refresh token was revoked or expired), immediately bypass any retry logic, clear the local session, call `api.post('/auth/logout', { access_token: '', refresh_token: '' })` to delete the cookie, and redirect the user to `/login` with a `redirect` query parameter.
  2. If any other request gets a `401`, attempt to refresh the token. If that refresh attempt fails (e.g. throws a 401 due to a revoked refresh token), catch the error, clear the local session, call `/auth/logout` with the empty token payload, and redirect to `/login`.

**Tech Stack:** Axios v1, React, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/api/client.ts` | Update Axios response interceptor to handle refresh 401 failures, call `/auth/logout` to delete backend cookie, and redirect to `/login` |

---

## Task 1: Update Axios Response Interceptor

**Files:**
- Modify: `src/api/client.ts`

- [ ] **Step 1: Replace the response interceptor in `src/api/client.ts`**

  We will update the response interceptor in `src/api/client.ts` to handle:
  - Immediate short-circuit on `/auth/refresh` 401 (no retry loop)
  - Calling `/auth/logout` with `{ access_token: '', refresh_token: '' }` to clear the cookie
  - Redirecting to `/login?redirect=...` if not already on the login page

  Replace the response interceptor block (lines 42 to 91 in the file) with:

  ```ts
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Helper function to handle session cleanup, logout call, and redirect
      const handleTokenRevocation = async () => {
        authService.clearSession();
        _refreshSubscribers = [];

        try {
          // Pass empty tokens as requested to tell the backend to delete the cookie
          await api.post('/auth/logout', {
            access_token: '',
            refresh_token: '',
          });
        } catch (logoutError) {
          console.error('Failed to call logout API during 401 handling:', logoutError);
        }

        const pathname = window.location.pathname;
        if (pathname !== '/login') {
          const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
          window.location.href = redirectUrl;
        }
      };

      // 1. Short-circuit: if the refresh request itself fails with a 401
      if (
        error.response?.status === 401 &&
        originalRequest.url?.endsWith('/auth/refresh')
      ) {
        await handleTokenRevocation();
        return Promise.reject(error);
      }

      // 2. Only attempt refresh on 401 for other endpoints, and only once per request
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
        // Pass an empty object {} as body to satisfy backend schema validation
        const response = await api.post<{
          data: { access_token: string; user: import('@/features/auth/types').AuthUser };
        }>('/auth/refresh', {});

        const newData = response.data.data;
        authService.setSession(newData);

        // Replay all queued requests with the new token
        notifyRefreshSubscribers(newData.access_token);

        // Retry the original failed request
        originalRequest.headers.Authorization = `Bearer ${newData.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. 401 because the refresh token was revoked)
        await handleTokenRevocation();
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
  git commit -m "fix(auth): handle 401 token revocation by clearing session, calling logout, and redirecting"
  ```

---

## Self-Review Checklist

- [x] **Correct status code** — Triggered only on `401` status ✅
- [x] **No infinite loop** — Short-circuit added if request URL ends with `/auth/refresh` ✅
- [x] **Logout payload matches** — Sends `{ access_token: '', refresh_token: '' }` as requested ✅
- [x] **Local state cleared** — calls `authService.clearSession()` ✅
- [x] **Redirected correctly** — Redirects to `/login` with encoded `pathname` unless already on `/login` ✅
- [x] **Type consistency** — Checked via `npx tsc --noEmit` ✅
- [x] **No placeholders** — Code changes fully shown ✅
