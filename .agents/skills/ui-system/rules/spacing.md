# Spacing & Layout

## Core Scale

Koinku uses Tailwind's default spacing scale. Stick to multiples of 4px — never invent arbitrary gaps.

| Token             | px   | Primary use                                  |
| ----------------- | ---- | -------------------------------------------- |
| `space-1` / `p-1` | 4px  | Icon padding, tight inline gaps              |
| `space-2` / `p-2` | 8px  | Badge padding, chip inner spacing            |
| `space-3` / `p-3` | 12px | List item vertical padding, compact cards    |
| `space-4` / `p-4` | 16px | **Standard card padding**, page section gaps |
| `space-5` / `p-5` | 20px | Generous card padding (hero cards)           |
| `space-6` / `p-6` | 24px | Page top padding, modal padding              |
| `space-8` / `p-8` | 32px | Section separation, large hero areas         |
| `space-12`        | 48px | Page-level vertical breathing room           |

> **Never use `p-7`, `p-9`, or other off-rhythm values.** They break the visual rhythm.

---

## Page Layout

```tsx
// Full page wrapper
<div className="min-h-screen bg-background">
  // Top header area
  <header className="px-4 pt-6 pb-4">...</header>
  // Main scrollable content
  <main className="px-4 space-y-4 pb-24">...</main>
  // Bottom nav (mobile-first)
  <nav className="fixed bottom-0 inset-x-0 bg-card border-t border-border px-4 py-3">
    ...
  </nav>
</div>
```

- **Horizontal page padding:** always `px-4` (16px each side). Never `px-3` or `px-5`.
- **Bottom padding on `<main>`:** `pb-24` to clear the fixed bottom nav.
- **Section gap:** `space-y-4` between cards/sections; bump to `space-y-6` if sections are visually heavy.

---

## Card Spacing

```tsx
// Standard card — most content
<Card className="p-4">

// Dense card — list containers, compact widgets
<Card className="p-3">

// Hero card — balance summary, featured stat
<Card className="p-5">
```

**Inside a card:**

```tsx
<Card className="p-4">
  <div className="flex items-center justify-between">
    <p className="text-sm font-medium text-foreground">Pengeluaran Bulan Ini</p>
    <Badge variant="secondary">Juni</Badge>
  </div>
  <p className="text-2xl font-semibold font-mono text-foreground mt-3">
    Rp 2.100.000
  </p>
  <p className="text-xs text-muted-foreground mt-1">↑ 12% dari bulan lalu</p>
</Card>
```

- Title → amount gap: `mt-3`
- Amount → subtitle gap: `mt-1`
- Never use both `CardHeader`/`CardContent` padding _and_ a manual `p-4` on the same card — pick one.

---

## List Items

```tsx
// Transaction row (inside a card, separated by border)
<div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
    <ShoppingCart className="w-5 h-5 text-muted-foreground" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-sm font-medium text-foreground truncate">
      Belanja Groceries
    </p>
    <p className="text-xs text-muted-foreground">Hari ini · Belanja</p>
  </div>
  <span className="text-sm font-mono text-destructive shrink-0">
    −Rp 85.000
  </span>
</div>
```

**List spacing rules:**

- Row vertical padding: `py-3`
- Icon to content gap: `gap-3`
- Icon size: `w-10 h-10` container, `w-5 h-5` icon — always `rounded-xl`
- Amount column: always `shrink-0` so it never wraps

---

## Icon Sizing

| Context            | Container   | Icon      | Shape         |
| ------------------ | ----------- | --------- | ------------- |
| Transaction row    | `w-10 h-10` | `w-5 h-5` | `rounded-xl`  |
| Category chip      | `w-8 h-8`   | `w-4 h-4` | `rounded-lg`  |
| Bottom nav         | —           | `w-6 h-6` | no container  |
| Inline with text   | —           | `w-4 h-4` | no container  |
| Hero / empty state | `w-16 h-16` | `w-8 h-8` | `rounded-2xl` |

---

## Form Spacing

```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="amount">Jumlah</Label>
    <Input id="amount" placeholder="Rp 0" className="font-mono" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="note">Catatan</Label>
    <Textarea id="note" placeholder="Opsional..." />
  </div>
  <Button className="w-full">Simpan</Button>
</div>
```

- Field gap: `space-y-4`
- Label-to-input gap: `space-y-2`
- Submit button: always `w-full` in forms, with `mt-2` if it needs visual separation from the last field

---

## Bottom Sheet / Modal Spacing

```tsx
<DialogContent className="px-4 pb-6 pt-4">
  <DialogHeader className="mb-4">
    <DialogTitle>Tambah Transaksi</DialogTitle>
  </DialogHeader>
  {/* form content */}
</DialogContent>
```

- Header bottom margin: `mb-4`
- Content bottom padding: `pb-6` (extra breathing room at bottom)
- Never reduce modal horizontal padding below `px-4`

---

## Responsive Approach

Koinku is mobile-first. Tablet/desktop is a bonus, not the target.

```tsx
// Single column on mobile, two on sm+
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

// Full-width on mobile, constrained on desktop
<div className="w-full max-w-md mx-auto">
```

---

## Anti-patterns

- ❌ `p-7`, `p-9`, `gap-7` — off-rhythm values
- ❌ `px-6` on the page wrapper — always `px-4`
- ❌ Manual `margin-top: 10px` inline style — use Tailwind margin utilities
- ❌ `gap-2` between full-width cards — use `space-y-4`
- ❌ Icon without a `shrink-0` in a flex row — it will compress under long text
- ❌ Nested scrollable containers — one scroll axis per screen
- ❌ Both `CardHeader` padding and manual `p-4` on the same card
