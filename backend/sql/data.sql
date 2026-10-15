-- ==============================================================================
-- GeoBlood Link: Synthetic Initial Seed Data (PostgreSQL)
-- Default Password for all accounts: password123
-- BCrypt Hash: $2a$10$w8.mP9Z6u08kY8L7lZ2O8uQyN1f5a5Vw0S11Zg38fT8K1H9.Q9PzO
-- ==============================================================================

-- 1. Synthetic Users
INSERT INTO users (id, name, email, phone, password_hash, role, verified, created_at, updated_at)
VALUES 
  (1, 'Aarav Sharma', 'donor@test.com', '+91 98765 43210', '$2a$10$w8.mP9Z6u08kY8L7lZ2O8uQyN1f5a5Vw0S11Zg38fT8K1H9.Q9PzO', 'DONOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Pooja Patel', 'pooja@example.com', '+91 98111 22334', '$2a$10$w8.mP9Z6u08kY8L7lZ2O8uQyN1f5a5Vw0S11Zg38fT8K1H9.Q9PzO', 'DONOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'City Care Hospital', 'hospital@test.com', '+91 22 2847 0000', '$2a$10$w8.mP9Z6u08kY8L7lZ2O8uQyN1f5a5Vw0S11Zg38fT8K1H9.Q9PzO', 'HOSPITAL', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'System Admin', 'admin@test.com', '+91 99999 88888', '$2a$10$w8.mP9Z6u08kY8L7lZ2O8uQyN1f5a5Vw0S11Zg38fT8K1H9.Q9PzO', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 2. Donor Profiles
INSERT INTO donor_profiles (id, user_id, blood_group, latitude, longitude, location_area, contact_number, is_available, eligibility_status, last_donation_date, total_donations, email_alerts, sms_alerts, emergency_push, created_at, updated_at)
VALUES
  (1, 1, 'O+', 19.1136, 72.8697, 'Andheri West, Mumbai', '+91 98765 43210', true, 'ELIGIBLE', '2024-05-15', 4, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 2, 'A-', 19.0596, 72.8295, 'Bandra East, Mumbai', '+91 98111 22334', false, 'COOLDOWN_PERIOD', '2024-07-20', 2, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Hospital Profiles
INSERT INTO hospital_profiles (id, user_id, facility_name, license_number, address, latitude, longitude, contact_phone, emergency_hotline, verification_status, created_at, updated_at)
VALUES
  (1, 3, 'City Care Hospital', 'HOSP-MUM-2024-981', 'Central Avenue, Sector 4, Mumbai', 19.0760, 72.8777, '+91 22 2847 0000', '+91 98200 11223', 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO NOTHING;

-- 4. Sample Blood Requests
INSERT INTO blood_requests (id, hospital_id, hospital_name, blood_group, blood_component, units_needed, urgency, status, hospital_location, patient_ref, notes, created_at, expires_at, accepted_count, matched_candidates_count)
VALUES
  (1, 1, 'City Care Hospital', 'O+', 'Whole Blood', 2, 'CRITICAL', 'OPEN', 'Central Avenue, Sector 4, Mumbai', 'Emergency Room - Bed 14', 'Accident trauma patient, immediate transfusion required.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '4 hours', 1, 3)
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Request Candidates / Invitations
INSERT INTO request_candidates (id, request_id, donor_id, rank_position, distance_km, approximate_area, eligibility, response_status, created_at)
VALUES
  (1, 1, 1, 1, 2.9, 'Andheri West', 'ELIGIBLE', 'PENDING', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- 6. Sample Donation Records
INSERT INTO donation_records (id, donor_id, hospital_id, hospital_name, blood_request_id, blood_group, blood_component, units_donated, donated_at, certificate_id, notes, authorized_staff, created_at)
VALUES
  (1, 1, 1, 'City Care Hospital', NULL, 'O+', 'Whole Blood', 1, '2024-05-15 14:00:00+00', 'CERT-2024-0515-O', 'Voluntary donation fulfilled safely.', 'Dr. S. Mehta', CURRENT_TIMESTAMP),
  (2, 1, NULL, 'Red Cross Regional Center', NULL, 'O+', 'Whole Blood', 1, '2023-11-10 10:30:00+00', 'CERT-2023-1110-O', 'Emergency replacement donation.', 'Dr. A. Rao', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
