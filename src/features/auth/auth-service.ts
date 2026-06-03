import type { AuthUser, LoginResponseData, AuthState } from './types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export class AuthService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  setSession(data: LoginResponseData): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getState(): AuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.getUser(),
      accessToken: this.getAccessToken(),
    };
  }
}

// Singleton instance used across the app
export const authService = new AuthService();
