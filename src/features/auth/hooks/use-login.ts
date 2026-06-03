import { useMutation } from '@tanstack/react-query';
import { useRouter, useSearch } from '@tanstack/react-router';
import { loginApi } from '../api';
import type { LoginRequest } from '../types';
import { authService } from '../auth-service';

export function useLogin() {
  const router = useRouter();
  // Typed search params from the /login route — redirect is a pathname string
  const { redirect } = useSearch({ from: '/login' });

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: async (data) => {
      // Persist tokens and user — this triggers authService._notify(),
      // which calls setAuth in InnerApp, causing a re-render with fresh context
      authService.setSession(data.data);

      // Wait for the router to re-evaluate context with the fresh auth state
      await router.invalidate();

      // Navigate to the originally requested page, or home
      router.navigate({ to: redirect ?? '/' });
    },
    onError: (error) => {
      console.error('[useLogin] login failed:', error);
    },
  });
}
