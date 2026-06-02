# Frontend Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a React frontend using Vite, TailwindCSS (v4), shadcn/ui, and TanStack Router/Query, organized with a clean, feature-driven architecture.

**Architecture:** We are using a feature-driven folder structure to keep code scalable and modular. We are relying on Vite for fast builds, TanStack for robust routing and server state, and Tailwind/shadcn for UI. Since Tailwind v4 was recently released, we will use Vite + Tailwind v4 + standard shadcn installation. We will use Bun for package management.

**Tech Stack:** React, Vite, TailwindCSS v4, shadcn/ui, TanStack Router, TanStack Query, Axios, React Hook Form, TypeBox/Zod, Bun.

**CRITICAL RULES:**

1. **Package Manager:** DO NOT use `npm` as it is slow. Use `bun` exclusively for all package management commands.
2. **Git Commits:** DO NOT commit changes during intermediate iterations or tasks. The commit should only be done when all requirements are finished, and the message should be `chore: initial commit for frontend setup`.

---

### Task 1: Initialize Vite React Project

**Files:**

- Create: `package.json`
- Create: `vite.config.ts`
- Create: `index.html`

- [ ] **Step 1: Run Vite initialization**

```bash
bun create vite@latest ./ --template react-ts
```

- [ ] **Step 2: Install core dependencies**

```bash
bun install
bun add @tanstack/react-router @tanstack/react-query axios react-hook-form @hookform/resolvers typebox
```

- [ ] **Step 3: Run dev server to verify**

Run: `bun run dev`
Expected: Server starts successfully on a local port (e.g., 5173). (Stop the server after verifying).

### Task 2: Setup Tailwind CSS v4

**Files:**

- Modify: `vite.config.ts`
- Modify: `src/index.css`
- Modify: `src/App.tsx` (or whatever the default entry is)

- [ ] **Step 1: Install Tailwind v4 and its Vite plugin**

```bash
bun add tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: Configure Vite Plugin**

Update `vite.config.ts` to include the Tailwind plugin:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
});
```

- [ ] **Step 3: Import Tailwind in CSS**

Replace the contents of `src/index.css` with the Tailwind v4 import:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Verify Tailwind works**

Replace `src/App.tsx` content with a simple test:

```tsx
function App() {
  return (
    <h1 className="text-3xl font-bold underline text-blue-500">
      Hello Tailwind v4
    </h1>
  );
}

export default App;
```

Run `bun run dev` and ensure the text is blue and underlined. (Stop the server after verifying).

### Task 3: Configure Path Aliases & Initialize shadcn/ui

**Files:**

- Modify: `tsconfig.app.json`
- Modify: `vite.config.ts`
- Create: `components.json`

- [ ] **Step 1: Configure Path Aliases in TypeScript**

Update `tsconfig.app.json` to add baseUrl and paths:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // ... rest of the existing options
  }
}
```

- [ ] **Step 2: Configure Path Aliases in Vite**

Install node types to use `path`:

```bash
bun add -D @types/node
```

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
bunx --bun shadcn@latest init -d
```

_(Note: Since we are using Tailwind v4, shadcn handles configuration slightly differently now, usually injecting CSS variables directly into index.css)._

- [ ] **Step 4: Verify shadcn installation by adding a Button**

```bash
bunx --bun shadcn@latest add button
```

Verify `src/components/ui/button.tsx` exists.

### Task 4: Setup Feature-Driven Architecture Folders

**Files:**

- Create: Various directories in `src/`

- [ ] **Step 1: Create directories**

```bash
mkdir -p src/api src/features/auth src/features/users src/features/roles src/features/stats src/hooks src/routes
```

- [ ] **Step 2: Create placeholder files to keep folders in source control**

```bash
touch src/api/.gitkeep src/features/auth/.gitkeep src/features/users/.gitkeep src/features/roles/.gitkeep src/features/stats/.gitkeep src/hooks/.gitkeep src/routes/.gitkeep
```

### Task 5: Setup TanStack Router

**Files:**

- Modify: `vite.config.ts`
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Install Router Vite Plugin**

```bash
bun add -D @tanstack/router-plugin
```

- [ ] **Step 2: Configure Router Plugin**

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [TanStackRouterVite(), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create Root Route**

Create `src/routes/__root.tsx`:

```tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
    </div>
  ),
});
```

- [ ] **Step 4: Create Index Route**

Create `src/routes/index.tsx`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-4">
      <h3 className="text-2xl font-bold">Welcome to TanStack Auth Starter</h3>
      <Button>Shadcn Button Works!</Button>
    </div>
  );
}
```

- [ ] **Step 5: Setup main application entry**

Update `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen"; // Will be generated

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

- [ ] **Step 6: Generate routes and verify**

Run `bun run dev` to let the TanStack Router plugin generate `src/routeTree.gen.ts`.
Verify the page loads at `http://localhost:5173/` and shows the styled heading and button. (Stop the server after verifying).

### Task 6: Setup TanStack Query and Axios Interceptors Boilerplate

**Files:**

- Create: `src/api/client.ts`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create Axios Client setup**

Create `src/api/client.ts`:

```typescript
import axios from "axios";

// Create base instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup interceptors for token handling (placeholders for now)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // TODO: Implement refresh token logic here when a 401 occurs
    return Promise.reject(error);
  },
);
```

- [ ] **Step 2: Setup React Query Provider**

Modify `src/main.tsx` to wrap the RouterProvider:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
```

### Task 7: Initial Commit

**Files:**

- Create: Initial git commit

- [ ] **Step 1: Commit all changes**

```bash
git add .
git commit -m "init: initial commit for frontend setup"
```
