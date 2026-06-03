import type { AuthUser, LoginResponseData, AuthState } from './types';

const USER_KEY = 'auth_user';

type AuthStateListener = (state: AuthState) => void;

export class AuthService {
  // Access token lives in memory only — never touches Web Storage
  private _accessToken: string | null = null;

  // Subscribers that want to be notified when auth state changes
  private _listeners: Set<AuthStateListener> = new Set();

  // ─── Getters ────────────────────────────────────────────────────────────────

  getAccessToken(): string | null {
    return this._accessToken;
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

  // ─── Subscriptions ───────────────────────────────────────────────────────────

  /**
   * Subscribe to auth state changes.
   * Returns an unsubscribe function — call it in useEffect cleanup.
   */
  subscribe(listener: AuthStateListener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private _notify(): void {
    const state = this.getState();
    this._listeners.forEach((listener) => listener(state));
  }

  // ─── Session Lifecycle ───────────────────────────────────────────────────────

  setSession(data: LoginResponseData): void {
    // Access token stored in-memory only
    this._accessToken = data.access_token;
    // User metadata stored in sessionStorage for display purposes
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    this._notify();
  }

  clearSession(): void {
    this._accessToken = null;
    sessionStorage.removeItem(USER_KEY);
    this._notify();
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
   * Attempts to silently restore a session by calling the refresh endpoint.
   * The browser sends the HttpOnly refresh_token cookie automatically.
   * Call this before mounting the React app.
   *
   * @param refreshFn - Function that calls POST /auth/refresh (no body needed)
   * @returns true if session was restored, false otherwise
   */
  async init(
    refreshFn: () => Promise<{ data: LoginResponseData }>
  ): Promise<boolean> {
    try {
      const response = await refreshFn();
      this.setSession(response.data);
      return true;
    } catch {
      // No valid refresh cookie or expired — user must log in
      this.clearSession();
      return false;
    }
  }
}

// Singleton instance used across the app
export const authService = new AuthService();
