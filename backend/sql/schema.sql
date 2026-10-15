-- ==============================================================================
-- GeoBlood Link: Normalized PostgreSQL Relational Schema
-- Architecture & Database Foundation (Member 1)
-- ==============================================================================

-- 1. Users / Accounts Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_user_role ON users (role);

-- 2. Donor Profiles Table
CREATE TABLE IF NOT EXISTS donor_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    blood_group VARCHAR(10),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_area VARCHAR(255),
    contact_number VARCHAR(30),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    eligibility_status VARCHAR(30) NOT NULL DEFAULT 'PROFILE_INCOMPLETE',
    last_donation_date DATE,
    total_donations INTEGER NOT NULL DEFAULT 0,
    email_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    sms_alerts BOOLEAN NOT NULL DEFAULT TRUE,
    emergency_push BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donor_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chk_donor_latitude CHECK (latitude IS NULL OR (latitude >= -90.0 AND latitude <= 90.0)),
    CONSTRAINT chk_donor_longitude CHECK (longitude IS NULL OR (longitude >= -180.0 AND longitude <= 180.0))
);

CREATE INDEX IF NOT EXISTS idx_donor_blood_group ON donor_profiles (blood_group);
CREATE INDEX IF NOT EXISTS idx_donor_is_available ON donor_profiles (is_available);
CREATE INDEX IF NOT EXISTS idx_donor_user_id ON donor_profiles (user_id);

-- 3. Hospital Profiles Table
CREATE TABLE IF NOT EXISTS hospital_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    facility_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    address VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    contact_phone VARCHAR(30),
    emergency_hotline VARCHAR(30),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hospital_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT chk_hosp_latitude CHECK (latitude IS NULL OR (latitude >= -90.0 AND latitude <= 90.0)),
    CONSTRAINT chk_hosp_longitude CHECK (longitude IS NULL OR (longitude >= -180.0 AND longitude <= 180.0))
);

CREATE INDEX IF NOT EXISTS idx_hospital_user_id ON hospital_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_hospital_verification ON hospital_profiles (verification_status);

-- 4. Blood Requests Table (Coordinated with Member 2)
CREATE TABLE IF NOT EXISTS blood_requests (
    id BIGSERIAL PRIMARY KEY,
    hospital_id BIGINT,
    hospital_name VARCHAR(255),
    blood_group VARCHAR(10) NOT NULL,
    blood_component VARCHAR(50) NOT NULL,
    units_needed INTEGER NOT NULL DEFAULT 1,
    urgency VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    hospital_location VARCHAR(500),
    patient_ref VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    accepted_count INTEGER NOT NULL DEFAULT 0,
    matched_candidates_count INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_request_hospital FOREIGN KEY (hospital_id) REFERENCES hospital_profiles (id) ON DELETE SET NULL,
    CONSTRAINT chk_units_needed CHECK (units_needed > 0)
);

CREATE INDEX IF NOT EXISTS idx_request_status ON blood_requests (status);
CREATE INDEX IF NOT EXISTS idx_request_blood_group ON blood_requests (blood_group);
CREATE INDEX IF NOT EXISTS idx_request_hospital ON blood_requests (hospital_id);

-- 5. Request Candidates / Invitations Table (Coordinated with Member 2)
CREATE TABLE IF NOT EXISTS request_candidates (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT NOT NULL,
    donor_id BIGINT NOT NULL,
    rank_position INTEGER,
    distance_km DOUBLE PRECISION,
    approximate_area VARCHAR(255),
    eligibility VARCHAR(30) DEFAULT 'ELIGIBLE',
    response_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    response_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_candidate_request FOREIGN KEY (request_id) REFERENCES blood_requests (id) ON DELETE CASCADE,
    CONSTRAINT fk_candidate_donor FOREIGN KEY (donor_id) REFERENCES donor_profiles (id) ON DELETE CASCADE,
    CONSTRAINT uk_candidate_request_donor UNIQUE (request_id, donor_id)
);

CREATE INDEX IF NOT EXISTS idx_candidate_request ON request_candidates (request_id);
CREATE INDEX IF NOT EXISTS idx_candidate_donor ON request_candidates (donor_id);
CREATE INDEX IF NOT EXISTS idx_candidate_status ON request_candidates (response_status);

-- 6. Donation Records Table
CREATE TABLE IF NOT EXISTS donation_records (
    id BIGSERIAL PRIMARY KEY,
    donor_id BIGINT NOT NULL,
    hospital_id BIGINT,
    hospital_name VARCHAR(255),
    blood_request_id BIGINT,
    blood_group VARCHAR(10),
    blood_component VARCHAR(50),
    units_donated INTEGER NOT NULL DEFAULT 1,
    donated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    certificate_id VARCHAR(100) UNIQUE,
    notes TEXT,
    authorized_staff VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donation_donor FOREIGN KEY (donor_id) REFERENCES donor_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_donation_hospital FOREIGN KEY (hospital_id) REFERENCES hospital_profiles (id) ON DELETE SET NULL,
    CONSTRAINT chk_units_donated CHECK (units_donated > 0)
);

CREATE INDEX IF NOT EXISTS idx_donation_donor ON donation_records (donor_id);
CREATE INDEX IF NOT EXISTS idx_donation_hospital ON donation_records (hospital_id);
CREATE INDEX IF NOT EXISTS idx_donation_certificate ON donation_records (certificate_id);

-- 7. Audit Events Table
CREATE TABLE IF NOT EXISTS audit_events (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100),
    target_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_events (actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_events (action);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_events (created_at);
