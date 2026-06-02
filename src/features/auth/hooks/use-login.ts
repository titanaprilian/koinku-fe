import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { loginApi } from '../api';
import type { LoginRequest } from '../types';

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginApi(credentials),
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.data.access_token);
      localStorage.setItem('refresh_token', data.data.refresh_token);

      // Navigate to home page after successful login
      router.navigate({ to: '/' });
    },
  });
}
