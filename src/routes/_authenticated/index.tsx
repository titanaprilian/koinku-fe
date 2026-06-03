import { createFileRoute, Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome to TanStack Auth Starter
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          A secure, high-performance starter template equipped with TanStack Router, TanStack Query, and Tailwind CSS.
        </p>
      </div>

      <Link
        to="/login"
        className={buttonVariants({ variant: 'default', size: 'default' })}
      >
        <LogIn className="w-4 h-4 mr-2" />
        Go to Login Page
      </Link>
    </div>
  );
}
