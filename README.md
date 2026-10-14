# GeoBlood Link — Frontend Application

> **Intelligent Geo-Localized Blood Donor Discovery and Emergency Matching System**  
> *Developed by Team Member 3 (Frontend & Client-Side Architecture)*

---

## 📌 Project Overview
GeoBlood Link connects hospital emergency blood requests with nearby voluntary, eligible donors based on proximity and blood group compatibility. 

> **⚠️ Medical & Coordination Notice:**  
> This software is an emergency discovery and coordination tool only. It does not replace hospital blood-bank protocols, clinical cross-matching, or medical judgment.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### Installation & Run
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the local development server:
   ```powershell
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`.
   - MSW (Mock Service Worker) will activate automatically in the browser (`[MSW] Mocking enabled`).
   - All API endpoints run locally against an in-memory database with stateful mutations (creates, accepts, declines, and cancellations are reflected immediately).

---

## 🔑 Demo Accounts (Mock Mode)

The mock database contains pre-configured accounts for testing each role. Use password `password123` for all accounts:

| Role | Email | Password | What You Can Test |
| :--- | :--- | :--- | :--- |
| **DONOR** | `donor@test.com` | `password123` | View emergency invitations, accept/decline with modal confirmations, toggle availability, update coordinates via browser GPS, view donation history. |
| **HOSPITAL** | `hospital@test.com` | `password123` | Create emergency blood requests, monitor live 15-second auto-polling, view ranked proximity matches (with privacy masking), cancel requests, record donation outcomes. |
| **ADMIN** | `admin@test.com` | `password123` | Review pending hospital credential verification requests with Approve/Reject actions. |

*Quick tip: On the `/login` screen, click the demo buttons to autofill these credentials instantly.*

---

## ⚙️ Environment Variables & Switching to Real Backend

All environment configuration is governed by `.env` (never commit real secrets to Git; refer to `.env.example`).

```env
# Set to 'true' to use Mock Service Worker (MSW) in the browser
# Set to 'false' to route requests to the Java Spring Boot backend
VITE_USE_MOCK=true

# API Base URL
# In mock mode, relative '/api' is intercepted by MSW
# When connecting to Spring Boot, set to e.g. 'http://localhost:8080/api'
VITE_API_BASE_URL=/api
```

### Switching to Spring Boot Backend (Members 1 & 2)
1. Open `.env`.
2. Change `VITE_USE_MOCK=false`.
3. Set `VITE_API_BASE_URL=http://localhost:8080/api`.
4. Restart the Vite dev server (`npm run dev`).
5. For contract adjustments, see [`docs/API_MISMATCH_GUIDE.md`](./docs/API_MISMATCH_GUIDE.md).

---

## 🧪 Testing

Run the automated Vitest unit and integration test suite:
```powershell
npm test
```
The test suite covers:
- **Validation:** required fields, email formatting, phone numbers, quantities, latitude/longitude bounds.
- **Double Submission Prevention:** button disables and displays loading spinners during in-flight requests.
- **Routing & Role Protection:** unauthenticated redirects to `/login` and role mismatch redirects.
- **Authentication:** login success and 401 error banner display.

For manual testing, follow the 10 scenarios in [`docs/E2E_TEST_CHECKLIST.md`](./docs/E2E_TEST_CHECKLIST.md).

---

## 📁 Folder Structure

```
src/
├── api/                  # API layer (Axios client, endpoints.js, resource services)
│   ├── auth.js           # Login & register endpoints
│   ├── client.js         # Central Axios client with interceptors
│   ├── donations.js      # Outcome recording
│   ├── donors.js         # Profile, availability, invitations
│   ├── endpoints.js      # SINGLE source of truth for all API routes
│   └── requests.js       # Hospital blood requests & candidate matches
├── components/           # Reusable UI components
│   ├── Button.jsx        # Double-submit prevention button
│   ├── ConfirmDialog.jsx # Accessible modal confirmation
│   ├── DataTable.jsx     # Responsive data table
│   ├── EmptyState.jsx    # Zero-data card
│   ├── ErrorMessage.jsx  # Error banner with Retry action
│   ├── Footer.jsx        # Mandatory medical disclaimer
│   ├── FormInput.jsx     # Accessible input with error/helper text
│   ├── Navbar.jsx        # Responsive navigation, notification bell & error toggle
│   ├── PageHeader.jsx    # Consistent header with back buttons
│   ├── ProtectedRoute.jsx# Role-based route guard
│   ├── Select.jsx        # Accessible dropdown
│   ├── Spinner.jsx       # Loading indicator
│   └── StatusBadge.jsx   # Visual badges for requests & responses
├── context/              # React Context Providers
│   ├── AuthContext.jsx   # Auth state, login, register, logout
│   ├── NotificationContext.jsx # In-app notification bell & unread counter
│   └── ToastContext.jsx  # In-app toast alerts (success, error, info)
├── hooks/                # Custom React hooks
│   ├── useFetch.js       # Async data fetching with loading & retry
│   └── usePolling.js     # Background polling hook (15s interval while OPEN)
├── mocks/                # Mock Service Worker & Synthetic Database
│   ├── browser.js        # Browser worker setup
│   ├── data.js           # Initial sample records
│   ├── db.js             # In-memory mutable database singleton
│   └── handlers.js       # MSW route handlers & business validation rules
├── pages/                # Application views
│   ├── admin/            # AdminDashboardPage
│   ├── auth/             # LoginPage, RegisterPage
│   ├── common/           # UnauthorizedPage (403)
│   ├── donor/            # DonorDashboardPage, DonorHistoryPage
│   ├── hospital/         # HospitalDashboardPage, CreateRequestPage, RequestDetailPage
│   ├── HomePage.jsx      # Landing page
│   └── NotFoundPage.jsx  # 404 handler
├── routes/               # AppRoutes.jsx route definitions
├── styles/               # main.css (plain CSS, responsive, mobile-first)
├── tests/                # Vitest test files & setup.js
└── utils/                # Utilities
    ├── errorHandler.js   # Standard API error parser
    ├── formatters.js     # Date, distance, and urgency formatters
    ├── tokenStorage.js   # Isolated token storage (localStorage vs HttpOnly cookies)
    └── validators.js     # Form validation helpers
```

---

## 🔒 Security & Privacy Practices

1. **Donor Privacy:**
   Exact home coordinates and telephone numbers are guarded and masked. Hospitals only receive distance and general district information until donor confirmation.
2. **Client-Side Token Isolation:**
   All token storage operations are isolated in `src/utils/tokenStorage.js`. See the architectural comment in that file explaining the tradeoffs between `localStorage` (XSS vulnerability) and `HttpOnly Cookies` (CSRF / CORS requirements).
3. **No Sensitive Console Logging:**
   Authentication tokens and passwords are never logged to `console.log`.
4. **Double Submission Protection:**
   Accept, Decline, and Create Request buttons are disabled while HTTP requests are in flight.
5. **Session Expiry Handling:**
   A central Axios response interceptor catches 401 Unauthorized responses, clears local storage, and redirects the user to `/login?sessionExpired=true`.

---

## ⚠️ Known Limitations (Current Frontend Scope)
- **Browser Geolocation:** In environments where browser location is disabled or denied, the system provides manual latitude and longitude fields.
- **SMS & Push Notifications:** The notification preference toggles in the donor profile are UI-only at this stage; integration with real SMS/FCM gateways will occur after the backend APIs stabilize.
