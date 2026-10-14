# API Contract Mismatch & Backend Integration Guide

When Members 1 and 2 complete the Java Spring Boot + PostgreSQL backend, minor contract differences may occur. This guide lists **exactly which files to edit** to adjust to any backend differences without breaking the UI components.

---

### Quick Reference: Where to Change What

| Scenario / Difference | Target File to Edit | What to Change |
| :--- | :--- | :--- |
| **URL Path Changed** (e.g. `/api/requests` → `/api/v1/blood-requests`) | [`src/api/endpoints.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/api/endpoints.js) | Change the route string in the `ENDPOINTS` dictionary. All components automatically use the new URL. |
| **Backend Base URL / Host** (e.g. `http://localhost:8080/api`) | [`.env`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/.env) | Set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=http://localhost:8080/api`. |
| **JWT Token Storage to HttpOnly Cookie** | [`src/utils/tokenStorage.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/utils/tokenStorage.js) & [`src/api/client.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/api/client.js) | In `client.js`, add `withCredentials: true`. In `tokenStorage.js`, disable `localStorage` writes since the browser handles the cookie automatically. |
| **Backend Response Envelope** (e.g. payload wrapped inside `{ success: true, payload: { ... } }`) | [`src/api/client.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/api/client.js) | In the response interceptor: `return response.data.payload || response.data;`. |
| **Backend Error Structure Changed** (e.g. Spring Boot standard error `{ timestamp, status, error, message }`) | [`src/utils/errorHandler.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/utils/errorHandler.js) | Update `parseApiError(error)` to extract `data.message || data.error`. |
| **Field Name Case Mismatch** (e.g. `blood_group` snake_case vs `bloodGroup` camelCase) | Target resource file in `src/api/` (`donors.js`, `requests.js`) | Map outbound request payload fields and inbound response fields in the corresponding API function before returning to UI components. |

---

### Step-by-Step Integration Examples

#### 1. Changing an Endpoint Route
If the backend changes `/api/requests/{id}/matches` to `/api/v1/emergency/{id}/candidates`:
Open [`src/api/endpoints.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/api/endpoints.js) and update:
```javascript
// Before:
REQUEST_MATCHES: (id) => `/requests/${id}/matches`,

// After:
REQUEST_MATCHES: (id) => `/v1/emergency/${id}/candidates`,
```

#### 2. Switching to the Real Spring Boot Backend
In [`.env`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/.env):
```env
# Disable Mock Service Worker
VITE_USE_MOCK=false

# Point Axios to your teammate's Spring Boot port
VITE_API_BASE_URL=http://localhost:8080/api
```
Restart your Vite server (`npm run dev`). All network requests will now hit Spring Boot directly.

#### 3. Handling Spring Boot Standard Validation Errors
If Spring Boot returns standard validation arrays like:
```json
{
  "timestamp": "2026-10-14T10:00:00Z",
  "status": 400,
  "errors": [
    { "field": "unitsNeeded", "defaultMessage": "must be greater than 0" }
  ]
}
```
Open [`src/utils/errorHandler.js`](file:///c:/Users/atharva/OneDrive/Desktop/sem%203/OOP/CP/src/utils/errorHandler.js) and adapt the field extraction:
```javascript
if (Array.isArray(data.errors)) {
  const fieldErrors = {};
  data.errors.forEach(err => {
    fieldErrors[err.field] = err.defaultMessage;
  });
  return { message: data.message || 'Validation error', fieldErrors };
}
```
All form components (`FormInput`, `Select`) will automatically display the backend's validation errors under the respective inputs!
