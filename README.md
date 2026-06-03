# tanstack-auth-starter

A production-ready React starter template with JWT authentication, type-safe routing, and server-state management — built on TanStack Router, TanStack Query, and Vite.

## Features

- **JWT authentication flow:** Login, silent token refresh via HttpOnly cookies, and automatic logout with redirect preservation.
- **Route-level guards:** Protected routes using TanStack Router's `beforeLoad` hook — unauthenticated users are redirected to `/login` with the original URL preserved.
- **Automatic token refresh:** Axios interceptors handle 401 responses by silently refreshing the access token and replaying failed requests, with a queue to prevent race conditions.
- **In-memory token storage:** Access tokens live only in JavaScript memory (never in localStorage or sessionStorage), reducing XSS attack surface.
- **Type-safe forms:** Login form validated with TypeBox schemas via React Hook Form, with real-time field-level error messages.
- **Feature-based architecture:** Code organized by domain (`features/auth`, `features/users`, `features/roles`, `features/stats`) with co-located components, hooks, API functions, and types.
- **shadcn/ui components:** Pre-configured with the Base Nova style, Tailwind CSS v4, and Lucide icons.

## Getting Started

```bash
git clone https://github.com/titanaprilian/tanstack-auth-starter-fe.git
cd tanstack-auth-starter-fe
bun install
cp .env.example .env.local   # see Environment Variables below
bun run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Environment Variables

| Variable       | Description                                         | Required |
| -------------- | --------------------------------------------------- | -------- |
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) | Yes      |

Create a `.env.local` file at the project root (or copy from `.env.example`) with these values. The API client defaults to `http://localhost:4000` when `VITE_API_URL` is not set.

## Project Structure

```
src/
├── api/              # Axios client with auth interceptors
├── components/ui/    # shadcn/ui primitives (Button, Card, Input, Label)
├── features/
│   ├── auth/         # Login flow, AuthService, token management
│   │   ├── api.ts            # loginApi, refreshApi, logoutApi
│   │   ├── auth-service.ts   # Singleton session manager (in-memory token)
│   │   ├── components/       # LoginForm
│   │   ├── hooks/            # useLogin mutation hook
│   │   └── types.ts          # AuthUser, LoginResponse, AuthState
│   ├── roles/        # Role management (scaffold)
│   ├── stats/        # Statistics (scaffold)
│   └── users/        # User management (scaffold)
├── hooks/            # Shared custom hooks
├── lib/              # Utility functions (cn)
├── routes/
│   ├── __root.tsx          # Root layout with RouterContext
│   ├── _authenticated.tsx  # Auth guard layout route
│   ├── _authenticated/     # Protected child routes
│   └── login.tsx           # Public login page
└── main.tsx          # App bootstrap with silent session restore
```

## Tech Stack

- [React 19](https://react.dev/) — UI library
- [Vite 8](https://vite.dev/) — build tool and dev server
- [TypeScript 6](https://www.typescriptlang.org/) — language
- [TanStack Router](https://tanstack.com/router) — file-based, type-safe routing
- [TanStack Query](https://tanstack.com/query) — server-state and mutation management
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [shadcn/ui](https://ui.shadcn.com/) — accessible component primitives
- [React Hook Form](https://react-hook-form.com/) + [TypeBox](https://github.com/sinclairzx81/typebox) — form handling and schema validation
- [Axios](https://axios-http.com/) — HTTP client with interceptors
- [Lucide](https://lucide.dev/) — icon set

## License

[MIT](LICENSE.md)
