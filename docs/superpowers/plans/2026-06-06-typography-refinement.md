# Typography Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine typography hierarchy on the dashboard to ensure primary metrics are visually dominant while supporting text is less prominent.

**Architecture:** Update React components to use larger typography scale sizes for metrics (`text-3xl font-bold text-foreground`) and ensure all secondary/supporting text leverages semantic muted colors (`text-muted-foreground` and smaller sizes).

**Tech Stack:** React, Tailwind CSS, shadcn/ui

---

### Task 1: Update Dashboard Stats Cards Typography

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Update metric classes for top stats cards**

Locate the 4 dashboard stat cards ("Total Users", "Active Users", "Total Roles", "Total Features").
Change the metric class from `text-2xl font-bold font-mono` to `text-3xl font-bold font-mono text-foreground`.

```tsx
// Example change for Total Users (apply to all 4 cards):
<div className="text-3xl font-bold font-mono text-foreground">{stats?.totalUsers ?? 0}</div>
```

- [ ] **Step 2: Ensure secondary text styling is muted**

Verify that the supporting descriptions (e.g., "0 inactive users", "Application features") use `text-xs text-muted-foreground` to adhere to the requested slate-500 equivalent. (They should already have this, but explicitly ensure no custom gray raw colors are used).

```tsx
<p className="text-xs text-muted-foreground">
  {stats?.inactiveUsers ?? 0} inactive {((stats?.inactiveUsers ?? 0) === 1) ? 'user' : 'users'}
</p>
```

### Task 2: Refine User Distribution Typography

**Files:**
- Modify: `src/routes/_authenticated/index.tsx`

- [ ] **Step 1: Ensure User Distribution secondary text is properly muted**

The `CardDescription` containing "Breakdown of users by role" automatically uses `text-sm text-muted-foreground`. No changes needed for the description itself as it perfectly aligns with the new UI system guidelines.

- [ ] **Step 2: Fix metric emphasis inside the distribution list**

In the distribution list, the user counts currently use `text-muted-foreground`. Update them to use `text-foreground` to stand out as metrics, while keeping the percentage muted.

```tsx
<div className="flex items-center justify-between">
  <span className="text-sm font-medium text-foreground">{item.roleName}</span>
  <span className="text-sm font-medium font-mono text-foreground">
    {item.count} {item.count === 1 ? 'user' : 'users'}{' '}
    <span className="font-normal text-muted-foreground">({percentage}%)</span>
  </span>
</div>
```
