import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '@/features/auth/components/login-form';

export const Route = createFileRoute('/login')({
  // Declare the search params this route accepts so useSearch() is typed
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
