# Update Button Style to Soft Indigo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the default shadcn button component to use the "Soft Indigo" UI standard with softer rounded corners and a premium shadow effect.

**Architecture:** Modify the `cva` variants in `src/components/ui/button.tsx` to include `rounded-xl` by default, `shadow-sm`, and hover animations (`hover:shadow-md hover:-translate-y-0.5`) for the default variant, and update the secondary variant styles to match the soft consumer app aesthetic.

**Tech Stack:** React, Tailwind CSS, class-variance-authority

---

### Task 1: Update Button Component Styles

**Files:**

- Modify: `src/components/ui/button.tsx:6-21`

- [ ] **Step 1: Update base and variant classes in buttonVariants**

In `src/components/ui/button.tsx`, locate `const buttonVariants = cva(...)`. We need to change the base `rounded-lg` to `rounded-xl`, update the `default` variant, update the `secondary` variant, and give the `destructive` variant a similar soft feel.

Update it to match this:

```tsx
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-destructive/90 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
```

- [ ] **Step 2: Verify visually (preliminary)**

Run: `bun run dev`
Expected: The local dev server starts. When you open the application, all buttons should have `rounded-xl` corners, but the colors might still appear black/gray until Task 2 is completed.

### Task 2: Update CSS Theme Colors

**Files:**
- Modify: `src/index.css:51-118`

- [ ] **Step 1: Update variables in :root and .dark**

In `src/index.css`, locate `:root` and `.dark` blocks. Replace the grayscale `--primary` and `--secondary` (along with their foregrounds, `--ring`, etc.) with HSL colors as specified in the `ui-system` rules.

Update it to match this:

```css
:root {
    --background: hsl(0 0% 98%);
    --foreground: hsl(224 15% 15%);
    --card: hsl(0 0% 100%);
    --card-foreground: hsl(224 15% 15%);
    --popover: hsl(0 0% 100%);
    --popover-foreground: hsl(224 15% 15%);
    --primary: hsl(245 70% 62%); /* soft indigo-violet */
    --primary-foreground: hsl(0 0% 100%);
    --secondary: hsl(250 40% 95%); /* very light lavender */
    --secondary-foreground: hsl(245 50% 40%);
    --muted: hsl(220 20% 96%);
    --muted-foreground: hsl(220 10% 50%);
    --accent: hsl(250 60% 95%);
    --accent-foreground: hsl(245 60% 45%);
    --destructive: hsl(0 72% 58%);
    --destructive-foreground: hsl(0 0% 100%);
    --border: hsl(220 20% 90%);
    --input: hsl(220 20% 88%);
    --ring: hsl(245 70% 62%);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --radius: 0.75rem;
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: hsl(245 70% 62%);
    --sidebar-primary-foreground: hsl(0 0% 100%);
    --sidebar-accent: hsl(250 40% 95%);
    --sidebar-accent-foreground: hsl(245 50% 40%);
    --sidebar-border: hsl(220 20% 90%);
    --sidebar-ring: hsl(245 70% 62%);
}

.dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: hsl(245 70% 68%); /* slightly lighter for dark bg contrast */
    --primary-foreground: hsl(0 0% 100%);
    --secondary: hsl(245 30% 18%);
    --secondary-foreground: hsl(245 50% 90%);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: hsl(245 70% 68%);
    --chart-1: oklch(0.87 0 0);
    --chart-2: oklch(0.556 0 0);
    --chart-3: oklch(0.439 0 0);
    --chart-4: oklch(0.371 0 0);
    --chart-5: oklch(0.269 0 0);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: hsl(245 70% 68%);
    --sidebar-primary-foreground: hsl(0 0% 100%);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(1 0 0 / 10%);
    --sidebar-ring: hsl(245 70% 68%);
}
```

- [ ] **Step 2: Start the dev server and verify visually**

Run: `bun run dev`
Expected: The primary buttons should now appear in soft indigo-violet color, and secondary buttons should have a soft lavender background with indigo-violet text.

