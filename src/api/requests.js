import apiClient from './client';
import { ENDPOINTS } from './endpoints';

/**
 * Emergency Blood Requests API Service
 * Handles hospital blood requests, ranked matches discovery, cancellation, and donor responses.
 */
export const requestsApi = {
  /**
   * Hospital creates a new emergency blood request
   * @param {Object} data - { bloodGroup, bloodComponent, unitsNeeded, urgency, hospitalLocation, patientRef, notes }
   */
  createRequest(data) {
    return apiClient.post(ENDPOINTS.REQUESTS, data);
  },

  /**
   * Hospital views its own created requests list
   */
  getHospitalRequests() {
    return apiClient.get(ENDPOINTS.REQUESTS);
  },

  /**
   * Retrieve single request by ID
   * @param {string|number} id
   */
  getRequestById(id) {
    return apiClient.get(ENDPOINTS.REQUEST_BY_ID(id));
  },

  /**
   * Cancel an open blood request
   * @param {string|number} id
   */
  cancelRequest(id) {
    return apiClient.patch(ENDPOINTS.REQUEST_CANCEL(id));
  },

  /**
   * Hospital retrieves ranked donor matches for a request.
   * NOTE: For privacy, contact numbers or precise home addresses are omitted by the backend.
   * @param {string|number} id
   */
  getRequestMatches(id) {
    return apiClient.get(ENDPOINTS.REQUEST_MATCHES(id));
  },

  /**
   * Donor accepts or declines a request invitation
   * @param {string|number} requestId
   * @param {'ACCEPTED'|'DECLINED'} status
   */
  respondToRequest(requestId, status) {
    return apiClient.post(ENDPOINTS.REQUEST_RESPONSES(requestId), { status });
  }
};

export default requestsApi;
