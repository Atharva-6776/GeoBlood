import axios from 'axios';
import { tokenStorage } from '../utils/tokenStorage';

/**
 * Central Axios Instance for all API communications.
 * 
 * Configured with:
 * 1. Base URL derived from environment variables (.env)
 * 2. Request Interceptor: Automatically attaches the Bearer JWT token if available.
 * 3. Response Interceptor: 
 *    - Unwraps response.data for cleaner async/await code.
 *    - Catches 401 Unauthorized errors to clear the expired token and redirect to login.
 */

// Use environment variable or fallback to '/api' for local MSW proxy
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Data Unwrapping & Session Expiry
apiClient.interceptors.response.use(
  (response) => {
    // Return the response data directly so components don't have to keep writing `res.data`
    return response.data;
  },
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and cached user
      tokenStorage.clearAuth();

      // Notify any listeners (like AuthContext)
      window.dispatchEvent(new CustomEvent('auth:session-expired'));

      // If not already on login page, redirect with an explanatory query param
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?sessionExpired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
