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
    <div className="min-h-screen flex">
      {/* The Visual Panel (Left) */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-slate-900 bg-cover bg-center relative"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-24 text-white h-full">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="font-bold text-xl text-primary-foreground">A</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">Auth Starter Pack</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Manage your system <br /> with confidence.
          </h1>
          <p className="text-lg text-slate-300 max-w-md">
            The definitive starter kit for your modern application. Experience seamless performance, access refresh token, and a minimalist interface.
          </p>
        </div>
      </div>

      {/* The Form Panel (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-background">
        <LoginForm />
      </div>
    </div>
  );
}
