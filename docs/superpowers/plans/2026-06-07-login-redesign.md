# Login Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the login page to use a split layout with a visual branding panel on the left and the login form on the right.

**Architecture:** We will modify the login route container to implement a responsive CSS flex split layout. We will also refactor the `LoginForm` component by stripping away the `Card` wrapper to fit seamlessly into the new right-hand panel, ensuring left-aligned headings.

**Tech Stack:** React, Tailwind CSS, Lucide React

---

### Task 1: Refactor the Login Form Component

**Files:**
- Modify: `src/features/auth/components/login-form.tsx:55-134`

- [ ] **Step 1: Remove Card wrapper and left-align header**

Replace the current return statement with a constrained layout div without the Card wrapper, and adjust header alignment.

```tsx
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <LogIn className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Sign in to your account to continue
        </p>
      </div>

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
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </div>
  );
```

- [ ] **Step 2: Clean up unused imports**

Since we removed the Card UI elements, remove them from the imports at the top of the file in `src/features/auth/components/login-form.tsx`.

```tsx
import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Type, type Static, FormatRegistry } from '@sinclair/typebox';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin } from '../hooks/use-login';
import { isAxiosError } from 'axios';
```

### Task 2: Implement the Split Layout in Login Route

**Files:**
- Modify: `src/routes/login.tsx:17-26`

- [ ] **Step 1: Update the LoginPage component to use the split layout**

Modify the return statement in `src/routes/login.tsx` to include the left visual panel and right form panel.

```tsx
function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* The Visual Panel (Left) */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-slate-900 bg-cover bg-center relative"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-24 text-white h-full">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="font-bold text-xl text-primary-foreground">S</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">SystemApp</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Manage your system <br /> with confidence.
          </h1>
          <p className="text-lg text-slate-300 max-w-md">
            The definitive starter kit for your modern application. Experience seamless performance, top-tier security, and a beautiful interface.
          </p>
        </div>
      </div>

      {/* The Form Panel (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
```
