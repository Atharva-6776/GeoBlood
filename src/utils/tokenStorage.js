/**
 * Token and User Session Storage Utility
 * 
 * SECURITY & ARCHITECTURAL NOTE:
 * We are currently storing the JWT / auth token in browser `localStorage`.
 * 
 * Tradeoffs to understand (especially for your team and exam presentations!):
 * 1. `localStorage`:
 *    - Advantage: Simple to set up in client-side Single Page Applications (SPAs).
 *      Works easily across different development domains (e.g., localhost:5173 to localhost:8080).
 *    - Disadvantage: Vulnerable to Cross-Site Scripting (XSS). Any rogue third-party
 *      script running in your browser tab can read `localStorage`.
 * 
 * 2. `HttpOnly Cookies` (Production recommendation):
 *    - Advantage: The browser stores the cookie, but JavaScript cannot read it (`document.cookie` is blocked).
 *      This protects the token from being stolen via XSS.
 *    - Disadvantage: Requires Cross-Site Request Forgery (CSRF) protection (SameSite flags, CSRF tokens)
 *      and proper CORS configuration (`credentials: 'include'` / `withCredentials: true`) across domains.
 * 
 * By isolating all token access in this single file, when Members 1 & 2 finish
 * the Spring Boot backend with HttpOnly cookies, we only need to change this file
 * rather than hunting through dozens of UI components!
 */

const TOKEN_KEY = 'blood_donation_auth_token';
const USER_KEY = 'blood_donation_user';

export const tokenStorage = {
  // Retrieve token from storage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Save token to storage (do NOT log tokens to console!)
  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Remove token
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Retrieve cached user object (id, name, role, email)
  getUser() {
    const rawUser = localStorage.getItem(USER_KEY);
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  },

  // Save user object
  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  // Clear all auth data (used on logout or session expiration)
  clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};
