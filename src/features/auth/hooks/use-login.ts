import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { loginApi } from '../api';
import type { LoginRequest } from '../types';
import { authService } from '../auth-service';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: (data) => {
      // Persist tokens and user via AuthService
      authService.setSession(data.data);

      // Invalidate the router so context.auth is refreshed on next navigation
      router.invalidate();

      // Navigate to home page after successful login
      router.navigate({ to: '/' });
    },
    onError: (error) => {
      console.error('[useLogin] login failed:', error);
    },
  });
}

