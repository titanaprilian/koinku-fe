# Upgrade Permissions Table and Role Input Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve usability of permissions tables by increasing header contrast and adding row hover/border tracks. In addition, add consistent icons (Shield, FileText) to the name and description inputs in create and edit role forms.

**Architecture:** We will modify the tailwind styling on the table elements (`TableHeader`, `TableRow`) inside the role-related components. For inputs, we will wrap them in relative containers with absolute Lucide icons and padding adjustments, matching the styling from `create-user-form.tsx`.

**Tech Stack:** React, Tailwind CSS v4, Lucide React, shadcn/ui

---

### Task 1: Add Input Icons and Upgrade Permissions Table in Create Role Dialog

**Files:**
- Modify: `src/features/roles/components/create-role-dialog.tsx`

- [ ] **Step 1: Import the new icons**

Modify `src/features/roles/components/create-role-dialog.tsx` to import `Shield` and `FileText` from `lucide-react`:

```tsx
import { Loader2, Shield, FileText } from 'lucide-react';
```

- [ ] **Step 2: Add icons to Name and Description input fields**

Wrap the `Input` components for Name and Description in `<div className="relative">` containers with the appropriate icons and padding adjustment classes:

For `name` field (around lines 205-222):
```tsx
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                          placeholder="e.g. Editor"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    ...
```

For `description` field (around lines 224-242):
```tsx
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                          placeholder="Optional description"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    ...
```

- [ ] **Step 3: Enhance Permissions Table headers and rows**

Update table headers to have higher contrast (`text-slate-600 dark:text-slate-400 font-semibold`):

```tsx
                    <TableHeader>
                      <TableRow className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-transparent">
                        <TableHead className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-semibold">
                          Feature
                        </TableHead>
                        <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">
                          All
                        </TableHead>
                        {OPERATIONS.map((op) => (
                          <TableHead
                            key={op}
                            className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold"
                          >
                            {OPERATION_LABELS[op]}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
```

Update the `TableRow` inside `TableBody` to have a slate border and background hover track:

```tsx
                      {features.map((feature) => (
                        <TableRow
                          key={feature.id}
                          className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors"
                        >
```

---

### Task 2: Add Input Icons and Upgrade Permissions Table in Edit Role Dialog

**Files:**
- Modify: `src/features/roles/components/edit-role-dialog.tsx`

- [ ] **Step 1: Import the new icons**

Modify `src/features/roles/components/edit-role-dialog.tsx` to import `Shield` and `FileText` from `lucide-react`:

```tsx
import { Loader2, Shield, FileText } from 'lucide-react';
```

- [ ] **Step 2: Add icons to Name and Description input fields**

Wrap the `Input` components for Name and Description in `<div className="relative">` containers with the appropriate icons and padding adjustment classes:

For `name` field (around lines 210-227):
```tsx
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                        placeholder="e.g. Editor"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  ...
```

For `description` field (around lines 229-246):
```tsx
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                        placeholder="Optional description"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  ...
```

- [ ] **Step 3: Enhance Permissions Table headers and rows**

Update table headers in the edit form to have higher contrast (`text-slate-600 dark:text-slate-400 font-semibold`):

```tsx
                  <TableHeader>
                    <TableRow className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-transparent">
                      <TableHead className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-semibold">
                        Feature
                      </TableHead>
                      <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">
                        All
                      </TableHead>
                      {OPERATIONS.map((op) => (
                        <TableHead
                          key={op}
                          className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold"
                        >
                          {OPERATION_LABELS[op]}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
```

Update the `TableRow` inside `TableBody` to have a slate border and background hover track:

```tsx
                    {features.map((feature) => (
                      <TableRow
                        key={feature.id}
                        className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors"
                      >
```

---

### Task 3: Upgrade Permissions Table in Read-Only Permissions Table

**Files:**
- Modify: `src/features/roles/components/role-permissions-table.tsx`

- [ ] **Step 1: Enhance Table headers and rows**

Update the headers (Feature, Create, Read, etc.) to have higher contrast (`text-slate-600 dark:text-slate-400 font-semibold`):

```tsx
        <TableHeader>
          <TableRow className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-transparent">
            <TableHead className="px-4 py-3 text-left text-slate-600 dark:text-slate-400 font-semibold">Feature</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Create</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Read</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Update</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Delete</TableHead>
            <TableHead className="px-4 py-3 text-center text-slate-600 dark:text-slate-400 font-semibold">Print</TableHead>
          </TableRow>
        </TableHeader>
```

Update the `TableRow` inside `TableBody` to have a slate border and background hover track:

```tsx
            permissions.map((perm) => (
              <TableRow key={perm.featureId} className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors">
```

---

### Task 4: Verify Compilation and Running

- [ ] **Step 1: Verify the build passes successfully**

Run: `bun run build`
Expected: Succeeds without errors.

- [ ] **Step 2: Verify code style passes linting**

Run: `bun run lint`
Expected: Succeeds without errors.
