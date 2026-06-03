# Fix Auth Refresh Request Body Schema Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the `Expected object` validation error on `/auth/refresh` by passing an empty object `{}` as the request body in all `/auth/refresh` and `/auth/logout` API calls.

**Architecture:**
- **Root cause:** The backend validates POST request bodies. Axios's `post(url)` without a second argument sends an empty request body (or no body at all), which triggers a root-level validation error (`Expected object`) in schema validators that expect a JSON request body.
- **Fix:** Pass an empty object `{}` as the second argument (the body) in all Axios POST requests for `/auth/refresh` and `/auth/logout`.

**Tech Stack:** React, Axios v1, TypeScript

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/features/auth/api.ts` | Pass `{}` as the body parameter for `/auth/refresh` and `/auth/logout` |
| **Modify** | `src/api/client.ts` | Pass `{}` as the body parameter in the response interceptor's silent refresh call |

---

## Task 1: Update API functions in `api.ts`

**Files:**
- Modify: `src/features/auth/api.ts`

Pass `{}` as the second argument in `api.post` for refresh and logout.

- [ ] **Step 1: Replace the entire `src/features/auth/api.ts`**

  ```ts
  import { api } from '@/api/client';
  import type { LoginRequest, LoginResponse, RefreshResponse } from './types';

  export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  }

  export async function refreshApi(): Promise<RefreshResponse> {
    // Send an empty object {} as body to satisfy backend schema validation
    const response = await api.post<RefreshResponse>('/auth/refresh', {});
    return response.data;
  }

  export async function logoutApi(): Promise<void> {
    // Send an empty object {} as body to satisfy backend schema validation
    await api.post('/auth/logout', {});
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/features/auth/api.ts
  git commit -m "fix(auth): pass empty body object to refresh and logout APIs"
  ```

---

## Task 2: Update Axios Response Interceptor in `client.ts`

**Files:**
- Modify: `src/api/client.ts`

Ensure the interceptor's refresh call also sends `{}` as the request body.

- [ ] **Step 1: Modify the `/auth/refresh` call in `src/api/client.ts`**

  Search for the `/auth/refresh` line in `src/api/client.ts` and modify the call:

  ```ts
      try {
        // Pass an empty object {} as body to satisfy backend schema validation
        const response = await api.post<{
          data: { access_token: string; user: import('@/features/auth/types').AuthUser };
        }>('/auth/refresh', {});

        const newData = response.data.data;
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/api/client.ts
  git commit -m "fix(auth): pass empty body object to refresh call in axios interceptor"
  ```

---

## Self-Review Checklist

- [x] **Root cause addressed** — Empty object `{}` passed to POST requests instead of no body ✅ Tasks 1 & 2
- [x] **All refresh calls updated** — Both `api.ts` and `client.ts` updated ✅
- [x] **Logout also updated** — Proactively fixed `/auth/logout` ✅ Task 1
- [x] **No new dependencies** — Standard Axios syntax ✅
- [x] **Type consistency** — Verification via `npx tsc --noEmit` ✅
- [x] **No placeholders** — Code changes explicitly shown ✅
