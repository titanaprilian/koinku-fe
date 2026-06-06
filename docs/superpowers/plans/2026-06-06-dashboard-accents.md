# Dashboard Accent Styling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the dashboard's visual interest and guide user attention by introducing subtle indigo brand accents (top borders on cards and soft-rounded icon containers) that conform to our semantic UI design system.

**Architecture:** We will utilize the design system's primary color (`--primary` / `bg-primary` / `text-primary`) rather than hardcoding Tailwind indigo palette classes directly, ensuring full compatibility with custom themes and dark mode. We will document these pattern standards in the `ui-system` rules and then apply them to the dashboard metric cards.

**Tech Stack:** React, Tailwind CSS v4, Lucide React

---

### Task 1: Update UI System Documentation

**Files:**
- Modify: `.agents/skills/ui-system/rules/components.md`

- [ ] **Step 1: Document Accent Cards and Metric Icon Containers**

In `.agents/skills/ui-system/rules/components.md`, locate the `### Cards` section and add new bullet points under `**Styling Rules (Interactive & Responsive):**` to document the standards for card accent borders and icon containers.

Replace:
```markdown
- **Base Styling:** Cards must have `bg-card`, a subtle border (`border border-border`), and a soft shadow (`shadow-sm`) to stand out from the page background.
- **Hover Effects:** Cards should feel interactive. Use `hover:shadow-md hover:border-primary/50 transition-all` when the card is clickable or represents a discrete item.
```

With:
```markdown
- **Base Styling:** Cards must have `bg-card`, a subtle border (`border border-border`), and a soft shadow (`shadow-sm`) to stand out from the page background.
- **Card Accents:** For key promotional or metric cards, add a colored top border using `border-t-4 border-t-primary`.
- **Icon Containers:** In metric cards, wrap Lucide icons in a soft, rounded primary container using `bg-primary/10 text-primary p-2 rounded-lg` to create a cohesive primary brand accent.
- **Hover Effects:** Cards should feel interactive. Use `hover:shadow-md hover:border-primary/50 transition-all` when the card is clickable or represents a discrete item.
```

### Task 2: Implement Metric Card Icon Containers & Top Borders

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Add accent borders and wrap icons for all metric cards**

In `src/routes/_authenticated/index.tsx`, update the four metric cards (Total Users, Active Users, Total Roles, Total Features) in the grid to include `border-t-4 border-t-primary` on the `Card` component, and wrap their respective icons in a `<div className="bg-primary/10 text-primary p-2 rounded-lg">` container.

Replace the grid block (lines 100-148):
```tsx
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.inactiveUsers ?? 0} inactive {((stats?.inactiveUsers ?? 0) === 1) ? 'user' : 'users'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.activeUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {activePercentage}% of total users
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalRoles ?? 0}</div>
            <p className="text-xs text-muted-foreground">Security access roles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalFeatures ?? 0}</div>
            <p className="text-xs text-muted-foreground">Application features</p>
          </CardContent>
        </Card>
      </div>
```

With:
```tsx
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-t-4 border-t-primary hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.inactiveUsers ?? 0} inactive {((stats?.inactiveUsers ?? 0) === 1) ? 'user' : 'users'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.activeUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {activePercentage}% of total users
            </p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Shield className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalRoles ?? 0}</div>
            <p className="text-xs text-muted-foreground">Security access roles</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary hover:shadow-md hover:border-primary/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{stats?.totalFeatures ?? 0}</div>
            <p className="text-xs text-muted-foreground">Application features</p>
          </CardContent>
        </Card>
      </div>
```

### Task 3: Verify Visuals & Build Quality

- [ ] **Step 1: Check lint rules**

Run: `bun run lint`
Expected: 0 errors, clean code checks.

- [ ] **Step 2: Check production build compatibility**

Run: `bun run build`
Expected: Successful compile and output in `dist/`.

- [ ] **Step 3: Run the local dev server and preview dashboard**

Run: `bun run dev`
Expected: Vite dev server runs at http://localhost:5173. Cards visually feature a top border accent and padded, rounded icon containers in indigo/primary branding colors.
