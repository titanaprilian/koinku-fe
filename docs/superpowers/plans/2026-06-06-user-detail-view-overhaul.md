# User Detail View Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the User Detail modal from a raw data list into a structured, visually appealing profile-oriented experience.

**Architecture:** We will replace the current single-column description list (`dl`) in `src/features/users/components/user-detail-dialog.tsx` with three distinct sections: a centered Profile Header with a large initials avatar, a two-column User Information grid, and a distinct Administrative Metadata container. We will use `ui-system` semantic tokens (`bg-primary/10`, `text-primary`, `bg-muted/50`) to match the exact aesthetic requirements.

**Tech Stack:** React, Tailwind CSS, shadcn/ui

---

### Task 1: Overhaul User Detail Component

**Files:**
- Modify: `src/features/users/components/user-detail-dialog.tsx`

- [ ] **Step 1: Replace the `dl` element with a `space-y-6` container and add the Profile Header**

Replace the existing `{user && !isLoading && ( <dl> ... </dl> )}` block with the new layout structure, starting with the Profile Header section.

```tsx
// Inside the DialogContent, replace the user data block with:
{user && !isLoading && (
  <div className="space-y-6 pt-4">
    {/* Profile Header */}
    <div className="flex flex-col items-center space-y-3 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>
    
    {/* Grid and Metadata will be added here */}
  </div>
)}
```

- [ ] **Step 2: Add the Two-Column Description Grid**

Below the Profile Header, insert the grid layout for the primary profile information (Role and Status). Note: We also apply the refined, softer status badge styling from the previous UI enhancements.

```tsx
    {/* User Information Grid */}
    <div className="grid grid-cols-[100px_1fr] items-center gap-y-4">
      <div className="text-sm font-medium text-muted-foreground">Role</div>
      <div className="text-sm text-foreground">{user.roleName}</div>
      
      <div className="text-sm font-medium text-muted-foreground">Status</div>
      <div className="text-sm text-foreground">
        {user.isActive ? (
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100">
            Active
          </Badge>
        ) : (
          <Badge className="border-border bg-muted text-muted-foreground hover:bg-muted/80">
            Inactive
          </Badge>
        )}
      </div>
    </div>
```

- [ ] **Step 3: Add the Administrative Metadata Section**

Finally, group the system-generated metadata inside a distinct rounded container at the bottom of the content block.

```tsx
    {/* Administrative Metadata */}
    <div className="space-y-3 rounded-lg bg-muted/50 p-4">
      <h4 className="text-sm font-semibold">System Information</h4>
      <div className="grid grid-cols-[80px_1fr] gap-y-2">
        <div className="text-xs font-medium text-muted-foreground">ID</div>
        <div className="break-all font-mono text-xs text-foreground">{user.id}</div>
        
        <div className="text-xs font-medium text-muted-foreground">Created</div>
        <div className="text-xs text-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
        
        <div className="text-xs font-medium text-muted-foreground">Updated</div>
        <div className="text-xs text-foreground">{new Date(user.updatedAt).toLocaleDateString()}</div>
      </div>
    </div>
```

- [ ] **Step 4: Verify Component Overhaul Locally**

Run: `bun run build`
Expected: Type checks and build succeed without errors.
Run: `bun run dev`
Expected: Open the application, open a user detail dialog, and verify the three structured sections appear correctly and provide strong visual hierarchy.
