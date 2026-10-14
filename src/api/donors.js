import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Donor API Service
 * Handles donor profiles, availability, emergency invitations, and donation history.
 */
export const donorsApi = {
  /**
   * Complete or create donor profile
   * @param {Object} profile - { name, bloodGroup, locationArea, contactNumber, latitude, longitude, notificationPrefs }
   */
  createProfile(profile) {
    return apiClient.post(ENDPOINTS.DONORS_PROFILE, profile);
  },

  /**
   * Fetch current authenticated donor's profile
   */
  getMe() {
    return apiClient.get(ENDPOINTS.DONORS_ME);
  },

  /**
   * Toggle or update donor availability status
   * @param {boolean} isAvailable
   */
  updateAvailability(isAvailable) {
    return apiClient.patch(ENDPOINTS.DONORS_AVAILABILITY, { isAvailable });
  },

  /**
   * Fetch matching invitations sent to this donor
   */
  getInvitations() {
    return apiClient.get(ENDPOINTS.DONORS_INVITATIONS);
  },

  /**
   * Fetch donor's own past donation history
   */
  getDonations() {
    return apiClient.get(ENDPOINTS.DONORS_DONATIONS);
  }
};

export default donorsApi;
