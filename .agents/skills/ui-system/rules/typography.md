# Typography

## Stack

```css
font-family: "Geist Sans", system-ui, sans-serif; /* body, UI */
font-family: "Geist Mono", monospace; /* numbers, amounts, code */
```

> **Money amounts always use Geist Mono.** Proportional fonts make currency columns misalign and feel imprecise.

---

## Scale

| Role            | Class                              | Size | Weight | Line height | Use                                 |
| --------------- | ---------------------------------- | ---- | ------ | ----------- | ----------------------------------- |
| Page title      | `text-2xl font-semibold`           | 24px | 600    | 1.3         | Screen headers                      |
| Section title   | `text-xl font-semibold`            | 20px | 600    | 1.3         | Card headers, group labels          |
| Subsection      | `text-base font-medium`            | 16px | 500    | 1.4         | List headers, modal titles          |
| Body            | `text-sm`                          | 14px | 400    | 1.6         | Descriptions, notes                 |
| Caption / label | `text-xs`                          | 12px | 400    | 1.5         | Timestamps, hints, secondary labels |
| Amount (large)  | `text-4xl font-bold font-mono text-foreground` | 36px | 700    | 1.1         | Balance totals, summary figures     |
| Amount (medium) | `text-3xl font-bold font-mono text-foreground` | 30px | 700    | 1.2         | Card-level figures                  |
| Amount (small)  | `text-sm font-medium font-mono text-foreground` | 14px | 500    | 1.6         | List row amounts                    |

---

## Color Pairings

Always use semantic color tokens — never raw Tailwind palette.

```tsx
// Primary text — for titles, important content
<p className="text-foreground">

// Secondary text — descriptions, supporting info (maps to slate-500/gray-400 visually)
<p className="text-muted-foreground text-sm">

// On colored backgrounds (badges, primary buttons)
<span className="text-primary-foreground">

// Currency — positive (income)
<span className="text-emerald-600 font-mono">+Rp 500.000</span>

// Currency — negative (expense)
<span className="text-destructive font-mono">−Rp 150.000</span>

// Currency — neutral (transfer, balance)
<span className="text-foreground font-mono">Rp 1.250.000</span>
```

---

## Hierarchy Rules

1. **Two levels max per component.** A card should have one `text-foreground` element and one `text-muted-foreground` element — not three layers.
2. **Metric Dominance.** Primary metrics must be visually dominant. Use larger sizes (`text-3xl`+), stronger weights (`font-bold`), and high contrast (`text-foreground`).
3. **Secondary Text Subordination.** Reduce the prominence of supporting text so it doesn't compete with metrics. Use `text-muted-foreground` (our semantic equivalent to `slate-500`/`gray-400`) combined with `text-sm` or `text-xs`.
4. **Weight over size for emphasis.** Prefer `font-medium` → `font-semibold` before reaching for a larger `text-*` size for non-metric text.
5. **Never bold body copy.** Bold is for headings, labels, and metrics only.
6. **Amounts are always mono.** Even a single-digit number in a transaction row uses `font-mono`.

---

## Patterns

### Screen header

```tsx
<div className="px-4 pt-6 pb-2">
  <h1 className="text-2xl font-semibold text-foreground">Keuangan</h1>
  <p className="text-sm text-muted-foreground mt-0.5">Juni 2025</p>
</div>
```

### Balance display

```tsx
<div className="text-center py-6">
  <p className="text-xs text-muted-foreground uppercase tracking-wide">
    Saldo Total
  </p>
  <p className="text-3xl font-semibold font-mono text-foreground mt-1">
    Rp 4.250.000
  </p>
</div>
```

### Transaction row

```tsx
<div className="flex items-center justify-between py-3">
  <div>
    <p className="text-sm font-medium text-foreground">Makan Siang</p>
    <p className="text-xs text-muted-foreground">Hari ini · Makanan</p>
  </div>
  <span className="text-sm font-mono text-destructive">−Rp 45.000</span>
</div>
```

### Category label / badge text

```tsx
<Badge variant="secondary">
  <span className="text-xs font-medium">Transportasi</span>
</Badge>
```

---

## Formatting Conventions (Indonesian Rupiah)

| Context             | Format                               | Example        |
| ------------------- | ------------------------------------ | -------------- |
| Full amounts        | `Rp` prefix, dot-separated thousands | `Rp 1.250.000` |
| Compact (summaries) | K/Jt shorthand                       | `Rp 4,2 Jt`    |
| Positive delta      | Leading `+`                          | `+Rp 500.000`  |
| Negative delta      | Leading `−` (minus sign, not hyphen) | `−Rp 150.000`  |

---

## Anti-patterns

- ❌ `className="text-gray-500"` — use `text-muted-foreground`
- ❌ `className="font-bold"` on body text — use `font-medium` max inside content
- ❌ `className="text-lg"` for amounts — use `font-mono` + appropriate size
- ❌ `style={{ fontSize: '13px' }}` — stay on the Tailwind scale
- ❌ Three or more distinct text colors in one card component
- ❌ Non-mono font for any currency value, even small ones
