# End-to-End (E2E) Manual Testing Checklist

This document details the step-by-step test cases for evaluating the **Intelligent Geo-Localized Blood Donor Discovery and Emergency Matching System** frontend. All tests can be run against the in-memory Mock Service Worker (MSW) or against the real Spring Boot backend.

---

### Test Summary Matrix

| ID | Test Scenario | Target Role | Expected Outcome |
| :--- | :--- | :--- | :--- |
| **TC-01** | Account Registration | Visitor | Validates required fields, role selection, creates account, redirects to login. |
| **TC-02** | Login & Bad Credentials | All | Correct credentials issue token and route to portal; bad credentials return 401 alert. |
| **TC-03** | Create Blood Request | Hospital | Validates blood type, units, urgency; broadcasts request and redirects to detail. |
| **TC-04** | Ranked Proximity Matches & Privacy | Hospital | Displays candidates ranked by distance; masks exact phone numbers and GPS coordinates. |
| **TC-05** | Accept / Decline Invitation | Donor | Modal confirmation pops up, disables in-flight button, updates status without reload. |
| **TC-06** | Duplicate / Full Capacity Response | Donor | Prevents duplicate answer; server returns 409 Conflict if units capacity already met. |
| **TC-07** | Response to Expired Request | Donor | Attempting to accept an expired request triggers 409 Conflict with friendly explanation. |
| **TC-08** | 401 Session Expiration | All | When session expires, token is cleared and user is redirected to `/login?sessionExpired=true`. |
| **TC-09** | Role-Based Access Routing (UX Guard) | All | Donor cannot enter `/hospital`; Hospital cannot enter `/donor`. Redirects safely. |
| **TC-10** | Network Failure & Retry | All | Toggling "🧪 Error Toggle" simulates 500 errors; error banners display functional **Retry** button. |

---

### Detailed Test Cases

#### TC-01: User Registration
- **Preconditions:** User is logged out.
- **Steps:**
  1. Navigate to `/register`.
  2. Attempt to click **Register** with empty fields.
  3. Verify client validation highlights mandatory fields (name, email, password).
  4. Fill Name: `Test Hospital Care`, Email: `newhospital@test.com`, Role: `Hospital / Blood Bank`, Password: `password123`, Confirm Password: `password123`.
  5. Click **Register**.
- **Expected Result:** Success notification banner appears: *"Account created successfully! Redirecting to login..."*. Page redirects to `/login`.

---

#### TC-02: Authentication & Wrong Password Handling
- **Preconditions:** On `/login`.
- **Steps:**
  1. Enter Email: `donor@test.com`, Password: `wrongpassword`.
  2. Click **Sign In**.
- **Expected Result:**
  - Status 401 is intercepted.
  - An error banner is displayed: *"Invalid email or password. The email or password you entered is incorrect."*
  - Password input is cleared/focused; no token is stored.
- **Subsequent Step:**
  - Click the **Donor (donor@test.com)** demo button to autofill valid credentials (`password123`).
  - Click **Sign In**.
  - **Result:** Successfully navigates to `/donor`. Navbar shows "DONOR" badge and user's name.

---

#### TC-03: Create Emergency Blood Request
- **Preconditions:** Logged in as `hospital@test.com`.
- **Steps:**
  1. Click **+ New Request** in the navbar or on dashboard.
  2. On `/hospital/requests/new`, observe the medical notice banner.
  3. Enter:
     - Blood Group: `O+`
     - Component: `Platelets`
     - Units Required: `2`
     - Urgency: `Critical`
     - Location: `City Care Hospital - ICU Trauma Wing`
     - Patient Ref: `Accident Case #108`
  4. Click **Broadcast Emergency Request**.
- **Expected Result:**
  - Button disables and shows spinner (preventing double clicks).
  - Toast notification appears: *"Emergency blood request created! Candidate matching initiated."*
  - Redirects to `/hospital/requests/{id}`.

---

#### TC-04: Ranked Candidate Match List & Donor Privacy Inspection
- **Preconditions:** On the Request Detail Page (`/hospital/requests/req-1` or newly created request).
- **Steps:**
  1. Scroll to the **Ranked Proximity Matches** table.
  2. Inspect the columns displayed: `Rank`, `Blood Group`, `Proximity Distance`, `Eligibility`, `Donor Response Status`.
  3. Check the privacy notice banner above the table.
- **Expected Result:**
  - Candidates are ordered by ascending distance (e.g. 1.4 km, 2.1 km, 3.2 km).
  - **PRIVACY VERIFICATION:** Neither telephone numbers nor exact street addresses appear in the table or network payload. Only broad neighborhood names (e.g. "Andheri West") and calculated distances are visible.

---

#### TC-05: Donor Invitation Accept / Decline Flow
- **Preconditions:** Logged in as `donor@test.com` on `/donor`.
- **Steps:**
  1. Locate the pending emergency invitation from *City Care Emergency Hospital*.
  2. Click **Accept Request**.
  3. A modal confirmation dialog appears: *"Are you sure you want to ACCEPT the emergency invitation...?"*
  4. Click **Yes, I Will Donate**.
- **Expected Result:**
  - The confirm button shows a loading spinner; background buttons are disabled.
  - Toast appears: *"Emergency request accepted! The hospital team has been alerted."*
  - The invitation card updates from `PENDING` to `ACCEPTED`.
  - Double submission is blocked.

---

#### TC-06: Duplicate Response Prevention
- **Preconditions:** Continuing from TC-05 on `/donor`.
- **Steps:**
  1. Observe the invitation card that was just accepted.
  2. Note that the Accept/Decline action buttons have been replaced with a static indicator: `Response: ACCEPTED`.
  3. If an API request is forced via DevTools with the same requestId, the server returns:
     `409 Conflict: "You have already accepted this invitation. Duplicate responses are not permitted."`

---

#### TC-07: Expired Request Response Handling
- **Preconditions:** Logged in as `donor@test.com`.
- **Steps:**
  1. Inspect the second invitation on the dashboard (marked with status `EXPIRED`).
  2. Notice the action buttons are inactive because the request window elapsed.
  3. Attempting to post a response to an expired request triggers a `409 Conflict`:
     `"This blood request is expired and can no longer accept responses."`

---

#### TC-08: 401 Session Expiration & Automatic Cleanup
- **Preconditions:** User is logged in on `/donor` or `/hospital`.
- **Steps:**
  1. Open DevTools Console (`F12`).
  2. Simulate token invalidation by running:
     ```javascript
     localStorage.removeItem('blood_donation_auth_token');
     ```
  3. Click any action that triggers an API call (or trigger a 401 event).
- **Expected Result:**
  - Axios response interceptor catches the 401.
  - `tokenStorage.clearAuth()` purges all local storage session keys.
  - Page redirects to `/login?sessionExpired=true`.
  - A warning alert informs the user: *"Your session has expired. Please log in again."*

---

#### TC-09: Role-Based UX Navigation Guard
- **Preconditions:** Logged in as `donor@test.com`.
- **Steps:**
  1. In the browser address bar, manually type `http://localhost:5173/hospital`.
  2. Press Enter.
- **Expected Result:**
  - `ProtectedRoute` evaluates user role (`DONOR`) against required role (`HOSPITAL`).
  - Access is intercepted; the user is redirected to `/donor` (or `/unauthorized`).
  - No hospital requests or administrative screens are rendered.

---

#### TC-10: Network Failure, 500 Simulation & Retry Action
- **Preconditions:** On `/donor` or `/hospital`.
- **Steps:**
  1. In the top navbar, click the **🧪 Error Toggle** button.
  2. Button changes to **⚠️ 500 Errors Active** with a red border, and a toast confirms: *"Simulated API Failures are now ENABLED (500 errors)"*.
  3. Click the **Refresh** button on the invitations list or requests dashboard.
- **Expected Result:**
  - MSW returns a 500 Internal Server Error.
  - An error banner is rendered: *"Error: [Simulated Failure] Could not fetch invitations."*
  - A prominent **🔄 Retry** button is rendered alongside the error.
  - Click **🧪 Error Toggle** again in the navbar to turn off simulated errors.
  - Click the **🔄 Retry** button in the error banner.
  - **Result:** The data re-fetches and renders successfully.
