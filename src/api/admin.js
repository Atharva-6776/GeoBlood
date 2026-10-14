import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Admin API Service (Mock)
 * Handles account verification workflow and admin audits.
 */
export const adminApi = {
  /**
   * Get list of pending hospital and donor accounts requiring verification
   */
  getPendingVerifications() {
    return apiClient.get(ENDPOINTS.ADMIN_VERIFICATIONS);
  },

  /**
   * Approve or reject an account
   * @param {string|number} id
   * @param {'APPROVED'|'REJECTED'} action
   */
  updateVerification(id, action) {
    return apiClient.patch(ENDPOINTS.ADMIN_VERIFY_ACTION(id), { action });
  }
};

export default adminApi;
