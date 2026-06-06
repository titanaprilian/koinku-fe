# User Form UI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve usability, consistency, and visual polish of the create and edit user forms by adding password visibility toggles, standardizing the role dropdown styling, and simplifying the active toggle controls.

**Architecture:** 
We will introduce local state (`useState`) to toggle password visibility and add eye/eye-off icons from `lucide-react`. The role dropdown currently uses shadcn's `Select`, but we will add the custom focus classes (`focus:border-primary focus:ring-2 focus:ring-primary/20`) to perfectly match the text input styling. Finally, we will remove the `rounded-lg border p-3` wrapper from the Active toggle `FormItem` to simplify the layout. We will apply these changes consistently across both `CreateUserForm` and `EditUserForm`.

**Tech Stack:** React, Tailwind CSS, shadcn/ui, lucide-react

---

### Task 1: Enhance Create User Form

**Files:**
- Modify: `src/features/users/components/create-user-form.tsx`

- [ ] **Step 1: Add imports and state**

Import `Eye` and `EyeOff` from `lucide-react`, and `useState` from `react`. Then, add the `showPassword` state inside the `CreateUserForm` component.

```tsx
// Update imports at the top
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Inside export function CreateUserForm(...) {
// Add this state below the existing hooks:
  const [showPassword, setShowPassword] = useState(false);
```

- [ ] **Step 2: Update Password Field**

Modify the password `Input` to switch types based on state, add padding right (`pr-10`) to prevent text overlapping the new icon, and add the visibility toggle button inside the relative container. Note: We map the PRD's raw colors (`text-slate-400`, `hover:text-indigo-600`) to our semantic UI tokens (`text-muted-foreground`, `hover:text-primary`).

```tsx
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        className="pl-10 pr-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20" 
                        placeholder="Min. 8 characters" 
                        {...field} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
```

- [ ] **Step 3: Standardize Role Dropdown**

Add the same focus ring styling used on the text inputs to the `SelectTrigger` so it matches seamlessly.

```tsx
                      <FormControl>
                        <SelectTrigger className="focus:border-primary focus:ring-2 focus:ring-primary/20">
                          <SelectValue
                            placeholder={isLoadingRoles ? 'Loading roles…' : 'Select a role'}
                          >
                            {selectedRole ? selectedRole.name : undefined}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
```

- [ ] **Step 4: Simplify Active Toggle**

Remove the `rounded-lg border p-3` classes from the `FormItem` wrapping the switch, keeping only the layout utility classes.

```tsx
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="mb-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
```

---

### Task 2: Enhance Edit User Form

**Files:**
- Modify: `src/features/users/components/edit-user-form.tsx`

- [ ] **Step 1: Add imports and state**

Import `useState` (if not already present), `Eye`, and `EyeOff`. Add the `showPassword` state inside the `EditUserForm` component.

```tsx
// Update imports at the top
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { typeboxResolver } from '@hookform/resolvers/typebox';
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Inside export function EditUserForm(...) {
// Add this state below the existing hooks:
  const [showPassword, setShowPassword] = useState(false);
```

- [ ] **Step 2: Update Password Field**

Update the password field to include the visibility toggle, matching the create form.

```tsx
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                          placeholder="Leave blank to keep current password"
                          {...field}
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
```

- [ ] **Step 3: Standardize Role Dropdown**

Add the identical focus styling to the `SelectTrigger` in the edit form.

```tsx
                          <FormControl>
                            <SelectTrigger className="focus:border-primary focus:ring-2 focus:ring-primary/20">
                              <SelectValue
                                placeholder={isLoadingRoles ? 'Loading roles…' : 'Select a role'}
                              >
                                {selectedRole ? selectedRole.name : undefined}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
```

- [ ] **Step 4: Simplify Active Toggle**

Remove the bordered container around the switch to use the inline layout.

```tsx
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="mb-0">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
```

---

### Task 3: Verify the Build

- [ ] **Step 1: Run build check**

Run: `bun run build`
Expected: Succeeds without errors, confirming all type imports and syntax are correct.
