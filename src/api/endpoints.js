/**
 * Central API Endpoints Definition
 * 
 * ARCHITECTURAL BENEFIT:
 * All API route URLs are defined in this single file. If the Java Spring Boot
 * backend team changes a path (e.g. from /api/requests to /api/v1/emergency-requests),
 * you only need to change it here rather than finding and replacing across dozens of files!
 */

export const ENDPOINTS = {
  // Authentication
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',

  // Donor Management
  DONORS_PROFILE: '/donors',
  DONORS_ME: '/donors/me',
  DONORS_AVAILABILITY: '/donors/me/availability',
  DONORS_INVITATIONS: '/donors/me/invitations',
  DONORS_DONATIONS: '/donors/me/donations',

  // Blood Requests & Emergency Matching
  REQUESTS: '/requests',
  REQUEST_BY_ID: (id) => `/requests/${id}`,
  REQUEST_CANCEL: (id) => `/requests/${id}/cancel`,
  REQUEST_MATCHES: (id) => `/requests/${id}/matches`,
  REQUEST_RESPONSES: (id) => `/requests/${id}/responses`,

  // Donations Outcome Recording
  DONATIONS: '/donations',

  // Admin (mock verification endpoints)
  ADMIN_VERIFICATIONS: '/admin/verifications',
  ADMIN_VERIFY_ACTION: (id) => `/admin/verifications/${id}`
};

export default ENDPOINTS;
