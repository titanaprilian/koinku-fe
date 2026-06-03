# Implement Dashboard Logout Button and User Info Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder "Go to Login Page" link on the protected dashboard route (`/`) with a professional greeting displaying the authenticated user's details and a fully functional "Log out" button.

**Architecture:**
- **Dashboard Component (`src/routes/_authenticated/index.tsx`):**
  1. Retrieve the logged-in user's details (name, email) from `authService.getUser()`.
  2. Implement an asynchronous `handleLogout` function that triggers `logoutApi()`, clears the local session via `authService.clearSession()`, invalidates the router context, and routes the user back to the `/login` page.
  3. Support a loading state during logout using a react state `isLoggingOut`.

**Tech Stack:** TanStack Router v1, React, UI components (Button)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/routes/_authenticated/index.tsx` | Display logged-in user details and replace login link with a functional logout button |

---

## Task 1: Update Dashboard Component

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Replace the entire `src/routes/_authenticated/index.tsx`**

  ```tsx
  import { createFileRoute, useRouter } from '@tanstack/react-router';
  import { Button } from '@/components/ui/button';
  import { LogOut } from 'lucide-react';
  import { authService } from '@/features/auth/auth-service';
  import { logoutApi } from '@/features/auth/api';
  import { useState } from 'react';

  export const Route = createFileRoute('/_authenticated/')({
    component: Index,
  });

  function Index() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const user = authService.getUser();

    const handleLogout = async () => {
      setIsLoggingOut(true);
      try {
        await logoutApi();
      } catch (error) {
        console.error('[Index] logout failed:', error);
      } finally {
        authService.clearSession();
        await router.invalidate();
        router.navigate({ to: '/login' });
      }
    };

    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground text-center">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            You are logged in as <span className="font-semibold text-foreground">{user?.email}</span>.
          </p>
        </div>

        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  npx tsc --noEmit
  ```

  Expected: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add src/routes/_authenticated/index.tsx
  git commit -m "feat(auth): display user info and add logout button on dashboard"
  ```

---

## Self-Review Checklist

- [x] **Correct user details displayed** — Reads from `authService.getUser()` ✅ Task 1
- [x] **Functional logout button** — Triggers both backend logout API and local session cleanup ✅ Task 1
- [x] **Safe router navigation** — Invalidates router context and redirects to `/login` ✅ Task 1
- [x] **No new dependencies** — Uses existing Lucide icons and UI Button component ✅ Task 1
- [x] **Type consistency** — Verification via `npx tsc --noEmit` ✅
- [x] **No placeholders** — Code changes fully specified ✅
