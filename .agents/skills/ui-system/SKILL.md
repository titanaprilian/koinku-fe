---
name: ui-system
description: Enforce UI design system rules for a soft, friendly consumer app using Tailwind CSS and shadcn/ui. Activate when building any UI component, page, layout, or screen — even for small tasks like "add a button", "style this card", "create a form", or "make this look better". Also triggers on any mention of colors, spacing, typography, components, or visual styling. Always use this skill before writing any JSX, className, or shadcn import.
---

# UI System — Tailwind + shadcn/ui

Design system rules for a **soft & friendly, light-mode-first consumer app** (social/productivity).

## Stack

- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **Font**: Geist Sans (body), Geist Mono (code)

## Quick Reference

| Category | Rule Files       | Impact                              |
| -------- | ---------------- | ----------------------------------- |
| CRITICAL | Color tokens     | Consistent palette, no raw hex/rgb  |
| CRITICAL | Component usage  | Right component for the right job   |
| HIGH     | Typography       | Readable, friendly hierarchy        |
| HIGH     | Spacing & layout | Consistent rhythm, no magic numbers |

## Rule Files

Read the relevant rule file before implementing any UI:

- `rules/colors.md` — CSS variables, palette, semantic tokens, dark mode
- `rules/components.md` — Which shadcn component to use and when, anti-patterns
- `rules/typography.md` — Font sizes, weights, line heights, hierarchy
- `rules/spacing.md` — Spacing scale, padding, gaps, layout conventions

## Core Principles

**Always follow these regardless of which rule file you read:**

1. **Never use raw colors** — always use CSS variables (`text-foreground`, `bg-primary`, etc.), never `text-[#1a1a1a]` or `bg-blue-500`
2. **Soft over sharp** — prefer `rounded-xl` or `rounded-2xl`, avoid `rounded-none` or `rounded-sm` on containers
3. **Whitespace is intentional** — generous padding makes the UI feel friendly; don't compress spacing to fit more content
4. **Light mode first** — design for light, then layer dark mode variables; never assume dark background as default
5. **shadcn first** — always reach for a shadcn component before building custom; only build custom when shadcn truly doesn't fit

## How to Use

For any UI task:

1. Identify what you're building (component, page, form, layout)
2. Read the relevant rule file(s) from `rules/`
3. Implement following the rules
4. Self-check against the anti-patterns listed in each rule file
