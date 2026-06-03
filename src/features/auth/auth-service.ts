import type { AuthUser, LoginResponseData, AuthState, RefreshRequest } from './types';

const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

export class AuthService {
  // Access token lives in memory only — never touches Web Storage
  private _accessToken: string | null = null;

  // ─── Getters ────────────────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return this._accessToken;
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this._accessToken !== null;
  }

  // ─── Session Lifecycle ───────────────────────────────────────────────────────

  setSession(data: LoginResponseData): void {
    // Access token stored in-memory only
    this._accessToken = data.access_token;
    // Refresh token and user stored in sessionStorage (tab-scoped)
    sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }

  clearSession(): void {
    this._accessToken = null;
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  }

  getState(): AuthState {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.getUser(),
      accessToken: this._accessToken,
    };
  }

  // ─── Initialisation (call once on app startup) ───────────────────────────────

  /**
   * Attempts to silently restore a session from a stored refresh token.
   * Call this before mounting the React app.
   *
   * @param refreshFn - Function that calls POST /auth/refresh with the stored token
   * @returns true if session was restored, false otherwise
   */
  async init(
    refreshFn: (body: RefreshRequest) => Promise<{ data: LoginResponseData }>
  ): Promise<boolean> {
    const storedRefreshToken = this.getRefreshToken();
    if (!storedRefreshToken) return false;

    try {
      const response = await refreshFn({ refresh_token: storedRefreshToken });
      this.setSession(response.data);
      return true;
    } catch {
      // Refresh token is invalid or expired — clear storage
      this.clearSession();
      return false;
    }
  }
}

// Singleton instance used across the app
export const authService = new AuthService();
