# Quick Links Widget & 12-Column Layout Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a balanced 12-column dashboard layout by placing a premium "Quick Actions" widget alongside the "User Distribution" card, and enable deep-linking to open the Add User dialog directly.

**Architecture:** We will adjust the dashboard grid to a `grid-cols-12` format with User Distribution spanning `col-span-12 md:col-span-7` and the new Quick Actions widget spanning `col-span-12 md:col-span-5`. The Quick Actions widget will feature interactive, card-style buttons with micro-animations. We will update the `Users` page search parameter validation to open the "Add User" dialog when `?create=true` is present.

**Tech Stack:** React, Tailwind CSS v4, TanStack Router, Lucide React

---

### Task 1: Update UI System Documentation

**Files:**
- Modify: `.agents/skills/ui-system/rules/spacing.md`

- [ ] **Step 1: Document Asymmetric Multi-column Dashboard Layouts**

In `.agents/skills/ui-system/rules/spacing.md`, add a new section named `## Multi-column Dashboard Layouts` before `## Responsive Approach` to document the layout standard.

Add:
```markdown
## Multi-column Dashboard Layouts

For dashboard rows containing multiple cards with asymmetric layout, use a responsive 12-column grid:

```tsx
<div className="grid grid-cols-12 gap-4 lg:gap-6 mt-6">
  // Primary widget (takes ~60% width on desktop)
  <Card className="col-span-12 md:col-span-7">
    ...
  </Card>
  
  // Secondary widget (takes ~40% width on desktop)
  <Card className="col-span-12 md:col-span-5">
    ...
  </Card>
</div>
```
```

### Task 2: Support Deep-Linked Modals in Users Page

**Files:**
- Modify: `src/routes/_authenticated/users/index.tsx`

- [ ] **Step 1: Update validateSearch in users route**

In `src/routes/_authenticated/users/index.tsx`, update the `validateSearch` function to parse the optional `create` query parameter and return it.

Change:
```tsx
  validateSearch: (search: Record<string, unknown>): GetUsersParams => {
    let parsedIsActive: boolean | undefined = undefined;
    if (search.isActive !== undefined) {
      parsedIsActive = search.isActive === 'true' || search.isActive === true;
    }

    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
      roleId: search.roleId as string | undefined,
      isActive: parsedIsActive,
    };
  },
```

To:
```tsx
  validateSearch: (search: Record<string, unknown>): GetUsersParams & { create?: boolean } => {
    let parsedIsActive: boolean | undefined = undefined;
    if (search.isActive !== undefined) {
      parsedIsActive = search.isActive === 'true' || search.isActive === true;
    }

    return {
      page: Number(search?.page) || 1,
      limit: Number(search?.limit) || 10,
      search: search.search as string | undefined,
      roleId: search.roleId as string | undefined,
      isActive: parsedIsActive,
      create: search.create === 'true' || search.create === true || undefined,
    };
  },
```

- [ ] **Step 2: Initialize modal from search param and clear on close**

Modify the `UsersPage` component definition to initialize `createOpen` using `!!searchParams.create`. When the dialog closes, clear the `create` query parameter from the URL using `navigate`.

Change (lines 33-40 approx):
```tsx
function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
```

To:
```tsx
function UsersPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [createOpen, setCreateOpen] = useState(!!searchParams.create);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
```

And update the `CreateUserDialog` `onOpenChange` handler (around line 112 approx):
```tsx
      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />
```

To:
```tsx
      <CreateUserDialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open && searchParams.create) {
            navigate({
              search: (prev) => {
                const { create, ...rest } = prev;
                return rest;
              },
            });
          }
        }}
        onSuccess={handleCreateSuccess}
      />
```

### Task 3: Implement Quick Actions Panel and Grid Layout

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Update Imports and Implement Layout Grid**

In `src/routes/_authenticated/index.tsx`, update the imports to include `Link` and the new icons, and then replace the old 2-column distribution card container with a 12-column grid container containing both the "User Distribution" card and the new "Quick Actions" card.

Replace imports:
```tsx
import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Shield, Layers, AlertCircle } from 'lucide-react';
```

To:
```tsx
import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Users, Shield, Layers, AlertCircle, UserPlus, ShieldAlert, ChevronRight } from 'lucide-react';
```

Replace grid layout and content:
```tsx
      {stats?.userDistribution && stats.userDistribution.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
          <Card className="hover:shadow-md hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">User Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.userDistribution.map((item) => {
                const percentage = stats.totalUsers > 0
                  ? Math.round((item.count / stats.totalUsers) * 100)
                  : 0;
                return (
                  <div key={item.roleName} className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-foreground">{item.roleName}</span>
                       <span className="text-sm font-mono text-muted-foreground">
                        {item.count} {item.count === 1 ? 'user' : 'users'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}
```

With:
```tsx
      {stats?.userDistribution && stats.userDistribution.length > 0 && (
        <div className="grid grid-cols-12 gap-4 lg:gap-6 mt-6">
          <Card className="col-span-12 md:col-span-7 hover:shadow-md hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">User Distribution</CardTitle>
              <CardDescription>Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.userDistribution.map((item) => {
                const percentage = stats.totalUsers > 0
                  ? Math.round((item.count / stats.totalUsers) * 100)
                  : 0;
                return (
                  <div key={item.roleName} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{item.roleName}</span>
                      <span className="text-sm font-mono text-muted-foreground">
                        {item.count} {item.count === 1 ? 'user' : 'users'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="col-span-12 md:col-span-5 hover:shadow-md hover:border-primary/50 transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              <CardDescription>Common administrator workflows</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link
                to="/users"
                search={{ create: true }}
                className="group flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary/15 transition-colors">
                    <UserPlus className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Add New User</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Register a user to the platform</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>

              <Link
                to="/rbac/roles"
                className="group flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg group-hover:bg-primary/15 transition-colors">
                    <ShieldAlert className="size-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Manage Roles</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Configure access roles & permissions</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
```

### Task 4: Verify Code Quality & Compile

- [ ] **Step 1: Check lint rules**

Run: `bun run lint`
Expected: 0 errors, clean code checks.

- [ ] **Step 2: Check production build compatibility**

Run: `bun run build`
Expected: Successful compile and output in `dist/`.
