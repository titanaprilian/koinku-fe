import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { loginApi } from '../api';
import type { LoginRequest } from '../types';
import { authService } from '../auth-service';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: async (data) => {
      // Persist tokens and user via AuthService
      authService.setSession(data.data);

      // Wait for the router to re-evaluate context with fresh auth state.
      // This ensures beforeLoad guards see isAuthenticated: true.
      await router.invalidate();

      // Navigate to the originally requested page, or home
      const search = new URLSearchParams(window.location.search);
      const redirectTo = search.get('redirect') || '/';
      router.navigate({ to: redirectTo });
    },
    onError: (error) => {
      console.error('[useLogin] login failed:', error);
    },
  });
}
