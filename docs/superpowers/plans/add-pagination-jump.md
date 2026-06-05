# Pagination Jump Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the pagination UI across all tables to show page numbers and ellipses, allowing users to jump directly to specific pages (and see the total pages) instead of only clicking "Next" or "Previous".

**Architecture:** We will install the shadcn/ui `pagination` component, create a utility function to calculate visible page numbers (with ellipses for large page counts), and refactor the `UsersTable` and `RolesTable` components to use this numbered pagination control.

**Tech Stack:** React, Tailwind CSS, shadcn/ui, TypeScript

---

### Task 1: Install shadcn/ui pagination and create pagination utility

**Files:**
- Create: `src/lib/pagination.ts`
- Create/Modify: `src/components/ui/pagination.tsx` (via shadcn)

- [ ] **Step 1: Install pagination component**

Run: `bunx shadcn@latest add pagination`
Expected: Installs `pagination.tsx` to `src/components/ui/`.

- [ ] **Step 2: Create pagination helper function**

Create `src/lib/pagination.ts` to calculate which page numbers to display.

```typescript
export function generatePaginationLinks(currentPage: number, totalPages: number) {
  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
    }
  }
  return pages;
}
```

### Task 2: Refactor UsersTable to use numbered pagination

**Files:**
- Modify: `src/features/users/components/users-table.tsx`

- [ ] **Step 1: Update imports in `users-table.tsx`**

Replace the `Button` import in the pagination area with the new shadcn pagination components, and import our new helper.

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { generatePaginationLinks } from '@/lib/pagination';
```

- [ ] **Step 2: Replace pagination UI**

Locate the existing pagination div with the `Previous`, `{data.pagination.page}`, and `Next` buttons. Replace that specific part with the new layout below (keep the "Rows per page" Select intact):

```tsx
          <div className="flex items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(data.pagination.page - 1)}
                    className={data.pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {generatePaginationLinks(data.pagination.page, data.pagination.totalPages).map((page, i) => (
                  <PaginationItem key={i}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === data.pagination.page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(data.pagination.page + 1)}
                    className={data.pagination.page >= data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
```

### Task 3: Refactor RolesTable to use numbered pagination

**Files:**
- Modify: `src/features/roles/components/roles-table.tsx`

- [ ] **Step 1: Update imports in `roles-table.tsx`**

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { generatePaginationLinks } from '@/lib/pagination';
```

- [ ] **Step 2: Replace pagination UI**

Apply the exact same `Pagination` block replacement in the `roles-table.tsx` pagination section as was done in `UsersTable`.

```tsx
          <div className="flex items-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => onPageChange(data.pagination.page - 1)}
                    className={data.pagination.page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {generatePaginationLinks(data.pagination.page, data.pagination.totalPages).map((page, i) => (
                  <PaginationItem key={i}>
                    {page === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => onPageChange(page)}
                        isActive={page === data.pagination.page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => onPageChange(data.pagination.page + 1)}
                    className={data.pagination.page >= data.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
```

- [ ] **Step 3: Run TypeScript compiler to ensure no errors**

Run: `bun run build`
Expected: Completes without type errors.
