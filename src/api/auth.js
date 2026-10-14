import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<{ token: string, user: { id: string, name: string, role: string } }>}
   */
  login(credentials) {
    return apiClient.post(ENDPOINTS.AUTH_LOGIN, credentials);
  },

  /**
   * Register new user
   * @param {Object} data - { name, email, password, role }
   * @returns {Promise<{ message: string, user?: Object }>}
   */
  register(data) {
    return apiClient.post(ENDPOINTS.AUTH_REGISTER, data);
  }
};

export default authApi;
