# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a login page that authenticates users against the backend API at `localhost:4000/auth/login` and stores tokens for subsequent requests.

**Architecture:** A file-based route at `/login` renders a `LoginForm` component that uses `react-hook-form` with `typebox` validation. On submit, a TanStack Query `useMutation` calls the login API endpoint via the existing axios client. On success, tokens are stored in `localStorage` and the user is redirected to `/`.

**Tech Stack:** React 19, TanStack Router (file-based routing), TanStack Query (mutations), react-hook-form + @hookform/resolvers + typebox, axios, shadcn/ui (base-nova style), Tailwind CSS v4, Lucide React icons.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/api/client.ts` | Modify | Update default baseURL to port 4000 |
| `src/features/auth/types.ts` | Create | Auth request/response TypeScript types |
| `src/features/auth/api.ts` | Create | Login API function using axios client |
| `src/features/auth/hooks/use-login.ts` | Create | TanStack Query `useMutation` hook for login |
| `src/features/auth/components/login-form.tsx` | Create | Login form UI component with validation |
| `src/routes/login.tsx` | Create | Login route (TanStack Router file-based route) |

> **Note:** We will also need to install shadcn/ui components: `input`, `label`, `card` via the `shadcn` CLI.

---

### Task 1: Update API Client Base URL

**Files:**
- Modify: `src/api/client.ts:5`

- [ ] **Step 1: Update the default port from 3000 to 4000**

In `src/api/client.ts`, change line 5:

```typescript
// Before:
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

// After:
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
```

- [ ] **Step 2: Verify the change compiles**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/api/client.ts
git commit -m "fix: update API client default base URL to port 4000"
```

---

### Task 2: Create Auth Types and API Function

**Files:**
- Create: `src/features/auth/types.ts`
- Create: `src/features/auth/api.ts`

- [ ] **Step 1: Create auth types**

Create `src/features/auth/types.ts`:

```typescript
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
  refresh_token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  error: boolean;
  code: number;
  message: string;
  data: T;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
```

- [ ] **Step 2: Create login API function**

Create `src/features/auth/api.ts`:

```typescript
import { api } from '@/api/client';
import type { LoginRequest, LoginResponse } from './types';

export async function loginApi(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  return response.data;
}
```

- [ ] **Step 3: Verify the types compile**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/types.ts src/features/auth/api.ts
git commit -m "feat(auth): add login types and API function"
```

---

### Task 3: Create Login Mutation Hook

**Files:**
- Create: `src/features/auth/hooks/use-login.ts`

- [ ] **Step 1: Create the mutation hook**

Create `src/features/auth/hooks/use-login.ts`:

```typescript
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { loginApi } from '../api';
import type { LoginRequest } from '../types';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);

      // Navigate to home page after successful login
      router.navigate({ to: '/' });
    },
  });
}
```

- [ ] **Step 2: Verify the hook compiles**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/features/auth/hooks/use-login.ts
git commit -m "feat(auth): add useLogin mutation hook"
```

---

### Task 4: Install Required shadcn/ui Components

**Files:**
- Create: `src/components/ui/input.tsx` (via CLI)
- Create: `src/components/ui/label.tsx` (via CLI)
- Create: `src/components/ui/card.tsx` (via CLI)

- [ ] **Step 1: Install input component**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx shadcn@latest add input -y`
Expected: Input component installed at `src/components/ui/input.tsx`

- [ ] **Step 2: Install label component**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx shadcn@latest add label -y`
Expected: Label component installed at `src/components/ui/label.tsx`

- [ ] **Step 3: Install card component**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx shadcn@latest add card -y`
Expected: Card component installed at `src/components/ui/card.tsx`

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat(ui): add input, label, and card shadcn components"
```

---

### Task 5: Create the Login Route

**Files:**
- Create: `src/routes/login.tsx`

- [ ] **Step 1: Create the login route file**

Create `src/routes/login.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/login')({
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

- [ ] **Step 2: Verify route generation**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx tsc --noEmit`
Expected: No errors (TanStack Router plugin will auto-generate the route tree)

- [ ] **Step 3: Commit**

```bash
git add src/routes/login.tsx src/routeTree.gen.ts
git commit -m "feat(auth): add /login route"
```

---

### Task 6: Build the LoginForm Component

**Files:**
- Create: `src/features/auth/components/login-form.tsx`

- [ ] **Step 1: Create the LoginForm component**

Create `src/features/auth/components/login-form.tsx`:

```tsx
import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Type, type Static } from 'typebox';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin } from '../hooks/use-login';
import { isAxiosError } from 'axios';

const LoginSchema = Type.Object({
  email: Type.String({
    format: 'email',
    errorMessage: 'Please enter a valid email address',
  }),
  password: Type.String({
    minLength: 8,
    errorMessage: 'Password must be at least 8 characters',
  }),
});

type LoginFormValues = Static<typeof LoginSchema>;

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: typeboxResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  // Extract error message from API response
  const apiErrorMessage = loginMutation.error
    ? isAxiosError(loginMutation.error) && loginMutation.error.response?.data?.message
      ? loginMutation.error.response.data.message
      : 'An unexpected error occurred. Please try again.'
    : null;

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
          <LogIn className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API-level error alert */}
          {apiErrorMessage && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3">
              <p className="text-sm text-destructive">{apiErrorMessage}</p>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Verify the component compiles**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run the dev server and visually verify**

Run: `cd /home/titanic/dev/web/node/starter/tanstack-auth-starter && npm run dev`
Navigate to: `http://localhost:5173/login`

Expected:
- Centered card with a login icon at the top
- "Welcome back" heading with "Sign in to your account to continue" subtitle
- Email field with mail icon prefix and placeholder "you@example.com"
- Password field with lock icon prefix and placeholder "••••••••"
- Full-width "Sign in" button
- Form validation errors appear below fields on invalid submission
- Button shows spinner while login request is pending
- On successful login, user is redirected to `/`

- [ ] **Step 4: Commit**

```bash
git add src/features/auth/components/login-form.tsx
git commit -m "feat(auth): add LoginForm component with validation and mutation"
```

---

## Summary of Design Decisions

1. **Feature folder structure**: Auth-related code lives in `src/features/auth/` following the existing project convention. Hooks in `hooks/`, components in `components/`, API functions and types at the feature root.

2. **Validation with typebox**: The project already has `typebox` and `@hookform/resolvers` installed. This keeps validation consistent and provides type inference from the schema.

3. **Error handling**: API errors are extracted from the axios error response and displayed as an inline alert (per UI system rules — never use toast for errors requiring user action). Field-level validation errors are shown below each input.

4. **Token storage**: Using `localStorage` consistent with the existing interceptor pattern in `src/api/client.ts`.

5. **UI design tokens**: All colors use CSS variable semantic tokens (`text-foreground`, `text-muted-foreground`, `bg-destructive/10`, etc.). Rounded corners use `rounded-xl`/`rounded-2xl`. Spacing follows the 4px rhythm (`space-y-4`, `space-y-2`, `px-4`).

6. **Loading state**: Button spinner (`Loader2 animate-spin`) for the submit button per UI system rules (spinner only for button loading states).
