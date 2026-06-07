import axios from 'axios';
import { authService } from '@/features/auth/auth-service';

// Create base instance — withCredentials ensures the HttpOnly cookie is sent
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attaches the in-memory access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────────────────
// On 401: attempt one silent token refresh via cookie, then retry.
// If refresh also fails: clear session and reject.

let _isRefreshing = false;
let _refreshSubscribers: Array<(token: string) => void> = [];

function subscribeToRefresh(callback: (token: string) => void) {
  _refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(token: string) {
  _refreshSubscribers.forEach((cb) => cb(token));
  _refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Helper function to handle session cleanup, logout call, and redirect
    const handleTokenRevocation = async () => {
      authService.clearSession();
      _refreshSubscribers = [];

      try {
        // Pass empty tokens as requested to tell the backend to delete the cookie
        await api.post('/auth/logout', {
          access_token: '',
          refresh_token: '',
        });
      } catch (logoutError) {
        console.error('Failed to call logout API during 401 handling:', logoutError);
      }

      const pathname = window.location.pathname;
      if (pathname !== '/login') {
        const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        window.location.href = redirectUrl;
      }
    };

    // 1. Short-circuit: if the refresh request itself fails with a 401
    if (
      error.response?.status === 401 &&
      originalRequest.url?.endsWith('/auth/refresh')
    ) {
      await handleTokenRevocation();
      return Promise.reject(error);
    }

    // 2. Short-circuit: if the login request fails with a 401, do not attempt to refresh
    if (
      error.response?.status === 401 &&
      originalRequest.url?.endsWith('/auth/login')
    ) {
      return Promise.reject(error);
    }

    // 3. Only attempt refresh on 401 for other endpoints, and only once per request
    if (error.response?.status !== 401 || originalRequest._retried) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request until it resolves
    if (_isRefreshing) {
      return new Promise<string>((resolve) => {
        subscribeToRefresh(resolve);
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      });
    }

    // Mark this request as already retried to prevent infinite loops
    originalRequest._retried = true;
    _isRefreshing = true;

    try {
      // Pass an empty object {} as body to satisfy backend schema validation
      const response = await api.post<{
        data: { access_token: string; user: import('@/features/auth/types').AuthUser };
      }>('/auth/refresh', {});

      const newData = response.data.data;
      authService.setSession(newData);

      // Replay all queued requests with the new token
      notifyRefreshSubscribers(newData.access_token);

      // Retry the original failed request
      originalRequest.headers.Authorization = `Bearer ${newData.access_token}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed (e.g. 401 because the refresh token was revoked)
      await handleTokenRevocation();
      return Promise.reject(refreshError);
    } finally {
      _isRefreshing = false;
    }
  }
);
