# Color Tokens & Theming

## CSS Variable System

All colors must use shadcn's CSS variable tokens. Never use raw Tailwind palette classes (`blue-500`, `gray-200`) or hex values.

### Semantic Tokens (use these)

```css
/* Backgrounds */
--background        /* Page background — near white #FAFAFA */
--card              /* Card/surface background */
--popover           /* Popover/dropdown background */
--muted             /* Subtle background for inactive/secondary areas */

/* Foregrounds (text) */
--foreground        /* Primary text */
--card-foreground   /* Text on cards */
--muted-foreground  /* Secondary/hint text — use for labels, captions */
--popover-foreground

/* Brand */
--primary           /* Main brand color — actions, links, highlights */
--primary-foreground /* Text on primary background */
--secondary         /* Secondary actions, tags */
--secondary-foreground

/* Feedback */
--destructive       /* Errors, delete actions */
--destructive-foreground

/* Borders & Inputs */
--border            /* Default border */
--input             /* Input field border */
--ring              /* Focus ring */

/* Accent */
--accent            /* Hover states, subtle highlights */
--accent-foreground
```

### Palette (globals.css)

Set up a warm, soft palette — gentle and approachable, not clinical or sterile:

```css
@layer base {
  :root {
    --background: 210 40% 98%; /* #f8fafc soft slate-50 */
    --foreground: 224 15% 15%; /* near-black with warmth */

    --card: 0 0% 100%;
    --card-foreground: 224 15% 15%;

    --popover: 0 0% 100%;
    --popover-foreground: 224 15% 15%;

    --primary: 245 70% 62%; /* soft indigo-violet */
    --primary-foreground: 0 0% 100%;

    --secondary: 250 40% 95%; /* very light lavender */
    --secondary-foreground: 245 50% 40%;

    --muted: 220 20% 96%;
    --muted-foreground: 220 10% 50%;

    --accent: 250 60% 95%;
    --accent-foreground: 245 60% 45%;

    --destructive: 0 72% 58%;
    --destructive-foreground: 0 0% 100%;

    --border: 220 20% 90%;
    --input: 220 20% 88%;
    --ring: 245 70% 62%;

    --radius: 0.75rem; /* base radius — rounded-xl equivalent */
  }
}
```

### Tailwind Usage

```tsx
// ✅ CORRECT — use semantic tokens
<div className="bg-background text-foreground">
<p className="text-muted-foreground">
<button className="bg-primary text-primary-foreground">
<div className="border border-border">

// ❌ WRONG — raw palette
<div className="bg-gray-50 text-gray-900">
<p className="text-gray-400">
<button className="bg-indigo-500 text-white">
<div className="border border-gray-200">

// ❌ WRONG — arbitrary values
<div className="bg-[#FAFAFA] text-[#1a1a1a]">
```

### Feedback Colors

For status indicators use these patterns, not raw colors:

```tsx
// Success
<span className="text-emerald-600 bg-emerald-50 border-emerald-200">

// Warning
<span className="text-amber-600 bg-amber-50 border-amber-200">

// Info
<span className="text-sky-600 bg-sky-50 border-sky-200">

// Error — use destructive token
<span className="text-destructive bg-destructive/10">
```

These are the only exceptions where Tailwind palette classes are allowed — for semantic feedback states not covered by shadcn tokens.

### Dark Mode

Always add dark mode variants when setting background/text colors. Use the `.dark` class strategy:

```css
.dark {
  --background: 224 20% 8%;
  --foreground: 220 15% 92%;
  --card: 224 20% 11%;
  --muted: 224 15% 14%;
  --muted-foreground: 220 10% 55%;
  --border: 224 15% 18%;
  --input: 224 15% 20%;
  --primary: 245 70% 68%; /* slightly lighter for dark bg contrast */
  --secondary: 245 30% 18%;
  --accent: 245 40% 16%;
}
```

### Anti-patterns

- ❌ `className="bg-white"` — use `bg-background` or `bg-card`
- ❌ `className="text-black"` — use `text-foreground`
- ❌ `className="text-gray-500"` — use `text-muted-foreground`
- ❌ `className="border-gray-200"` — use `border-border`
- ❌ `style={{ color: '#6366f1' }}` — use className with CSS variables
- ❌ Hardcoding opacity on colors — use Tailwind's `/` opacity syntax: `bg-primary/10`
