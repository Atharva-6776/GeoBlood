/**
 * Standard API Error Parser
 * 
 * Our proposed API contract returns errors in this standard structure:
 * {
 *   "status": 400,
 *   "message": "Human readable summary",
 *   "errors": {
 *     "fieldName": "Specific validation error for this field"
 *   }
 * }
 * 
 * This helper safely extracts field errors and top-level messages.
 */

export function parseApiError(error) {
  if (!error) {
    return {
      message: 'An unexpected error occurred.',
      fieldErrors: {}
    };
  }

  // Network error or no response from server
  if (!error.response) {
    return {
      message: error.message || 'Network error. Please check your connection.',
      fieldErrors: {}
    };
  }

  const data = error.response.data;

  // If backend returns the standard error payload
  if (data && typeof data === 'object') {
    return {
      message: data.message || `Request failed with status ${error.response.status}`,
      fieldErrors: data.errors || {},
      status: data.status || error.response.status
    };
  }

  // Fallback for HTML or plain text error responses
  return {
    message: `Server error (${error.response.status}). Please try again later.`,
    fieldErrors: {},
    status: error.response.status
  };
}
