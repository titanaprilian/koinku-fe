# Component Usage Rules

Always reach for a shadcn/ui component first. Only build custom when shadcn genuinely doesn't cover the use case.

## Decision Tree

```
Need a UI element?
├── Does shadcn have it? → Use shadcn
├── Can shadcn be composed to make it? → Compose shadcn
└── Neither? → Build custom, follow same token rules
```

## Component Reference

### Buttons

```tsx
import { Button } from "@/components/ui/button"

// Primary action (one per view)
<Button>Save Changes</Button>

// Secondary / cancel
<Button variant="secondary">Cancel</Button>

// Destructive
<Button variant="destructive">Delete Account</Button>

// Action buttons (Detail, Edit, Delete) - Subtle/Ghost style
// Icon-only or minimal text with soft hover states to reduce visual clutter
<Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground">
  <Pencil className="h-4 w-4" />
</Button>

// Ghost — for icon buttons, nav items
<Button variant="ghost" size="icon"><Heart /></Button>

// Outline — bordered, less emphasis than default
<Button variant="outline">Export</Button>

// Link style — inline actions
<Button variant="link">View details</Button>
```

**Styling Rules (Soft Indigo Standard):**

- **Primary (`variant="default"`):** Soft indigo color (`bg-primary text-primary-foreground`), `rounded-xl` shape, gentle shadow (`shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`).
- **Secondary (`variant="secondary"`):** Very light lavender background with indigo-violet text (`bg-secondary text-secondary-foreground`), `rounded-xl`, soft hover states (`hover:bg-secondary/80`).
- **Destructive (`variant="destructive"`):** Standard destructive token, but ensure it follows the `rounded-xl` soft shape.
- **Base Shape:** Base button styling should be softer (`rounded-xl` or `rounded-2xl`).

**Size rules:**

- `size="sm"` — inside tables, compact lists, tags
- `size="default"` — forms, modals, standard CTAs
- `size="lg"` — hero CTAs, onboarding screens only
- `size="icon"` — icon-only buttons, always pair with `aria-label`

**Anti-patterns:**

- ❌ Never use `<button>` HTML element directly — always `<Button>`
- ❌ Never use `size="lg"` inside cards or forms
- ❌ Never use multiple `default` variant buttons side by side — one primary, others `outline` or `ghost`

---

### Cards

**Styling Rules (Interactive & Responsive):**

- **Hover Effects:** Cards should feel interactive. Use `hover:shadow-md hover:border-primary/50 transition-all` when the card is clickable or represents a discrete item.
- **Responsive Layout:** Never let cards stretch to take full width on large screens (e.g. dashboard widgets). Always use a responsive grid (`grid grid-cols-1 md:grid-cols-2 gap-4` or similar) so they take full width on mobile but sit side-by-side on desktop.

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Interactive Card (Clickable or Widget)
<Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting description text</CardDescription>
  </CardHeader>
  <CardContent>
    {/* main content */}
  </CardContent>
  <CardFooter className="gap-2">
    <Button>Action</Button>
    <Button variant="ghost">Cancel</Button>
  </CardFooter>
</Card>

// Flat card (no shadow, subtle border — for dense lists)
<Card className="shadow-none border-border/60 hover:bg-muted/50 transition-colors">
  {/* content */}
</Card>

// Responsive Card Layout Container
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

**When to use Card:**

- Grouping related content (profile info, settings section, post)
- Dashboard widgets
- List items with multiple fields

**Anti-patterns:**

- ❌ Don't let cards stretch unbounded on large screens — wrap lists of cards in a `grid-cols-1 md:grid-cols-2` container
- ❌ Don't nest `<Card>` inside `<Card>` — use `bg-muted` for inner sections instead
- ❌ Don't use Card for single-line list items — use plain `div` with `border-b`

---

### Forms & Inputs

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"

// Always pair Input with Label
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>

// With react-hook-form (preferred for any form with validation)
<FormField
  control={form.control}
  name="username"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Username</FormLabel>
      <FormControl>
        <Input placeholder="@handle" {...field} />
      </FormControl>
      <FormDescription>This is your public display name.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Anti-patterns:**

- ❌ Never use `<input>` HTML element — always `<Input>`
- ❌ Never float labels (placeholder-as-label pattern) — always explicit `<Label>`
- ❌ Never show raw error strings in `<p>` — use `<FormMessage />`

---

### Dialogs & Modals

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    {/* content */}
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

**When to use Dialog vs Sheet:**

- `Dialog` — confirmations, short forms, focused tasks (max-w-md or max-w-lg)
- `Sheet` — side panels, filters, detail views, anything needing more vertical space

**Styling Rules (Minimalist & Sleek):**

- Sharp borders (`rounded-none` or `rounded-sm`) instead of large rounded corners
- Subtle shadows (`shadow-sm`)
- Clean white background (`bg-white` or `bg-background`)
- Simple dark overlay (default shadcn, avoid blurred backdrop)

---

### Navigation

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// In-page navigation (profile tabs, settings sections)
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="notifications">Notifications</TabsTrigger>
  </TabsList>
  <TabsContent value="account">...</TabsContent>
</Tabs>;
```

**When to use Tabs vs separate routes:**

- Tabs — content that shares context, quick switching (profile sections, settings)
- Routes — distinct pages with their own URL (home, explore, profile)

---

### Feedback & Status

```tsx
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Status badge (Vibrant & Solid preference)
// Bright, eye-catching solid colors with white text for high contrast
<Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-transparent">Active</Badge>
<Badge className="bg-rose-500 text-white hover:bg-rose-600 border-transparent">Overdue</Badge>
<Badge className="bg-blue-500 text-white hover:bg-blue-600 border-transparent">New</Badge>

// Inline alert (form-level feedback, not toast)
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

// Loading skeleton (always use instead of spinner for content areas)
<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-10 w-full rounded-xl" />
```

**Skeleton over spinner rule:** Use `<Skeleton>` for content loading states. Reserve spinner (`<Loader2 className="animate-spin" />`) only for button loading states and full-page transitions.

---

### Toasts / Notifications

```tsx
import { toast } from "sonner";

// Success
toast.success("Success", { description: "Your changes have been saved." });

// Error
toast.error("Error", { description: "Something went wrong." });
```

**Rules:**

- Use `toast` from `"sonner"`. Do not use the old `useToast` hook.
- **Title + Description format is REQUIRED**: Always pass `"Success"` or `"Error"` as the first argument (which renders as a bold title). Pass the actual message in the `description` field of the options object.
- Use toast for transient feedback (save, delete, copy)
- Never use toast for errors that require user action — use inline `<Alert>` instead
- Keep toast descriptions under 20 words.

---

### Dropdowns & Selects

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Select — form field with predefined options
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="member">Member</SelectItem>
  </SelectContent>
</Select>

// DropdownMenu — action menus, context menus (not form inputs)
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

**Select vs DropdownMenu:**

- `Select` — form inputs, settings choices, filters
- `DropdownMenu` — action menus, "more options" (⋯), right-click context

---

### Tables

**Styling Rules (Clean & Spaced):**

- **Row Index Column (No.):** Always include a row index/sequence column (typically titled "No.") as the first column in tables. This provides immediate context for the number of records and is calculated using the page offset: `(page - 1) * limit + index + 1`. Set a fixed width (e.g., `w-[80px]`) so it remains neat.
- Generous cell padding (e.g., `px-4 py-4` or `p-5`)
- Invisible vertical borders (do not use vertical dividers between columns)
- Subtle horizontal dividers (`border-b border-border/50`)
- Soft row hover states (`hover:bg-muted/50`) to improve readability

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// In map loops, calculate index using page pagination variables:
const page = 1;
const limit = 10;
const startNumber = (page - 1) * limit;

<Table>
  <TableHeader>
    <TableRow className="border-b border-border/50 hover:bg-transparent">
      <TableHead className="w-[80px] px-4 py-3 text-muted-foreground font-medium">No.</TableHead>
      <TableHead className="px-4 py-3 text-muted-foreground font-medium">Name</TableHead>
      <TableHead className="px-4 py-3 text-muted-foreground font-medium">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item, index) => (
      <TableRow key={item.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
        <TableCell className="px-4 py-4 text-muted-foreground font-medium">{startNumber + index + 1}</TableCell>
        <TableCell className="px-4 py-4">{item.name}</TableCell>
        <TableCell className="px-4 py-4">
          <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-transparent">Active</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Pagination

**Styling Rules (Soft Numbered Pills):**

- Rounded pill buttons for numbers (`rounded-full`)
- Distinct colored background for the active page (e.g., `bg-primary text-primary-foreground`)
- Soft hover states for inactive pages (`hover:bg-muted`)
- Avoid harsh borders on pagination items

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

<Pagination>
  <PaginationContent className="gap-1">
    <PaginationItem>
      <PaginationPrevious href="#" className="rounded-full px-4" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" className="rounded-full hover:bg-muted">
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" className="rounded-full px-4" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```
