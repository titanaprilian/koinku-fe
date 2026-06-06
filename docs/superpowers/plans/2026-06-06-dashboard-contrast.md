# Dashboard Contrast & Visual Hierarchy Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve visual hierarchy on the dashboard and across the app by increasing contrast between the page background and card elements, utilizing subtle elevation.

**Architecture:** Update the global UI system background token (`--background`) to a `slate-50` equivalent (`hsl(210 40% 98%)`) to provide depth. Modify the `Card` component to use explicit borders (`border-border`) and soft shadows (`shadow-sm`) instead of inner rings. Update the `ui-system` documentation to reflect these new standards.

**Tech Stack:** React, Tailwind CSS

---

### Task 1: Update UI System Documentation

**Files:**

- Modify: `.agents/skills/ui-system/rules/colors.md`
- Modify: `.agents/skills/ui-system/rules/components.md`

- [ ] **Step 1: Update colors documentation**

In `.agents/skills/ui-system/rules/colors.md`, find the `:root` palette definition and update `--background` to `210 40% 98%` (slate-50).

```css
--background: 210 40% 98%; /* #f8fafc soft slate-50 */
```

- [ ] **Step 2: Update components documentation for Cards**

In `.agents/skills/ui-system/rules/components.md`, locate the `### Cards` section and update the styling rules to reflect the new border and shadow approach.

Replace:

```markdown
- **Hover Effects:** Cards should feel interactive. Use `hover:shadow-md hover:border-primary/50 transition-all` when the card is clickable or represents a discrete item.
```

With:

```markdown
- **Base Styling:** Cards must have `bg-card`, a subtle border (`border border-border`), and a soft shadow (`shadow-sm`) to stand out from the page background.
- **Hover Effects:** Cards should feel interactive. Use `hover:shadow-md hover:border-primary/50 transition-all` when the card is clickable or represents a discrete item.
```

### Task 2: Update Theme Colors

**Files:**

- Modify: `src/index.css`

- [ ] **Step 1: Update background color in :root**

In `src/index.css`, find the `:root` block and update `--background` to the new slate-50 equivalent, and slightly adjust `--muted` to be a bit darker for contrast.

```css
--background: hsl(210 40% 98%);
--muted: hsl(210 40% 96%);
```

### Task 3: Update Card Component

**Files:**

- Modify: `src/components/ui/card.tsx`

- [ ] **Step 1: Update base Card classes**

In `src/components/ui/card.tsx`, locate the `Card` component. Remove the `ring-1 ring-foreground/10` classes and replace them with `border border-border shadow-sm`.

Change:

```tsx
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
```

To:

```tsx
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground border border-border shadow-sm has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
```

- [ ] **Step 2: Start the dev server and verify visually**

Run: `bun run dev`
Expected: The main page background should be a subtle off-white (slate-50), and the cards should clearly stand out with their white background, subtle border, and soft shadow.
