# User Management Form Refinements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the usability, visual refinement, and interaction feedback of the User Management create and edit forms.

**Architecture:** Update the `CreateUserForm` and `EditUserForm` components to include contextual icons within input fields, softer focus rings using `ui-system` tokens, and better spacing for action buttons. 

**Tech Stack:** React, Tailwind CSS, Lucide React

---

### Task 1: Refine Create User Form

**Files:**
- Modify: `src/features/users/components/create-user-form.tsx`

- [ ] **Step 1: Import required icons**

Import the `User`, `Mail`, and `Lock` icons from `lucide-react`.

```tsx
// Update the lucide-react import at the top of the file:
import { Loader2, User, Mail, Lock } from 'lucide-react';
```

- [ ] **Step 2: Add icons and refine focus states for Input fields**

Wrap the `Input` components for Name, Email, and Password with a relative container, add the absolute positioned icon, and apply the refined focus state classes and padding to the `Input` itself. 
*Note: We translate `indigo-500` to `primary` and `slate-400` to `muted-foreground` to follow `ui-system`.*

```tsx
// Update the Name field:
<FormControl>
  <div className="relative">
    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="John Doe" 
      {...field} 
    />
  </div>
</FormControl>

// Update the Email field:
<FormControl>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      type="email" 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="john@example.com" 
      {...field} 
    />
  </div>
</FormControl>

// Update the Password field:
<FormControl>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      type="password" 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="Min. 8 characters" 
      {...field} 
    />
  </div>
</FormControl>
```

- [ ] **Step 3: Adjust Action Button Spacing**

Update the `DialogFooter` spacing to ensure a 3-unit gap between buttons, overriding shadcn's default `sm:space-x-2`.

```tsx
// Update the DialogFooter wrapper:
<DialogFooter className="gap-3 sm:space-x-0">
  <Button ...>
```

---

### Task 2: Refine Edit User Form

**Files:**
- Modify: `src/features/users/components/edit-user-form.tsx`

- [ ] **Step 1: Import required icons**

Import the `User`, `Mail`, and `Lock` icons from `lucide-react`.

```tsx
// Update the lucide-react import at the top of the file:
import { Loader2, User, Mail, Lock } from 'lucide-react';
```

- [ ] **Step 2: Add icons and refine focus states for Input fields**

Apply the same `relative` wrappers, icons, and `Input` styling (padding and focus states) to the Name, Email, and Password fields in the edit form.

```tsx
// Update the Name field:
<FormControl>
  <div className="relative">
    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="John Doe" 
      {...field} 
    />
  </div>
</FormControl>

// Update the Email field:
<FormControl>
  <div className="relative">
    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      type="email" 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="john@example.com" 
      {...field} 
    />
  </div>
</FormControl>

// Update the Password field:
<FormControl>
  <div className="relative">
    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    <Input 
      type="password" 
      className="pl-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
      placeholder="Leave blank to keep current password" 
      {...field} 
    />
  </div>
</FormControl>
```

- [ ] **Step 3: Adjust Action Button Spacing**

Update the `DialogFooter` in the edit form to match the 3-unit gap.

```tsx
// Update the DialogFooter wrapper:
<DialogFooter className="gap-3 sm:space-x-0">
  <Button ...>
```

- [ ] **Step 4: Verify Form Changes Locally**

Run: `bun run build`
Expected: Type checks and build succeed without errors.
Run: `bun run dev`
Expected: Open the application, trigger the Create User and Edit User dialogs, and verify that the icons render correctly, focus states are soft and use the primary color, and the action buttons are properly spaced.
