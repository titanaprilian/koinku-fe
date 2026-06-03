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

    // Only attempt refresh on 401, and only once per request
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
      // Refresh failed — clear session; user must log in again
      authService.clearSession();
      _refreshSubscribers = [];
      return Promise.reject(refreshError);
    } finally {
      _isRefreshing = false;
    }
  }
);
