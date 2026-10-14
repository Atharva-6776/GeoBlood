import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Donations API Service
 * Handles recording final donation outcomes after hospital fulfillment.
 */
export const donationsApi = {
  /**
   * Hospital or Admin records donation outcome
   * @param {Object} data - { requestId, donorId, unitsDonated, donatedAt, notes }
   */
  recordDonation(data) {
    return apiClient.post(ENDPOINTS.DONATIONS, data);
  }
};

export default donationsApi;
