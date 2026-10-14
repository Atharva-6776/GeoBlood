/**
 * In-Memory Mock Database
 * 
 * Simulates real backend data persistence across client actions (create, accept, decline, cancel, verify).
 * All data is purely synthetic.
 */

export const initialUsers = [
  {
    id: 'user-donor-1',
    name: 'Aarav Sharma',
    email: 'donor@test.com',
    password: 'password123',
    role: 'DONOR'
  },
  {
    id: 'user-donor-2',
    name: 'Pooja Patel',
    email: 'donor2@test.com',
    password: 'password123',
    role: 'DONOR'
  },
  {
    id: 'user-hospital-1',
    name: 'City Care Emergency Hospital',
    email: 'hospital@test.com',
    password: 'password123',
    role: 'HOSPITAL',
    licenseNumber: 'HOSP-MUM-2024-981'
  },
  {
    id: 'user-admin-1',
    name: 'System Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN'
  }
];

export const initialDonorProfiles = {
  'user-donor-1': {
    id: 'donor-1',
    userId: 'user-donor-1',
    name: 'Aarav Sharma',
    bloodGroup: 'O+',
    isAvailable: true,
    locationArea: 'Andheri West, Mumbai',
    contactNumber: '+91 98765 43210',
    latitude: 19.1136,
    longitude: 72.8697,
    lastDonationDate: '2024-05-15',
    eligibilityStatus: 'ELIGIBLE',
    totalDonations: 4,
    notificationPrefs: {
      emailAlerts: true,
      smsAlerts: true,
      emergencyPush: true
    }
  },
  'user-donor-2': {
    id: 'donor-2',
    userId: 'user-donor-2',
    name: 'Pooja Patel',
    bloodGroup: 'A-',
    isAvailable: false,
    locationArea: 'Bandra East, Mumbai',
    contactNumber: '+91 98111 22334',
    latitude: 19.0596,
    longitude: 72.8295,
    lastDonationDate: '2024-07-20',
    eligibilityStatus: 'COOLDOWN_PERIOD',
    totalDonations: 2,
    notificationPrefs: {
      emailAlerts: true,
      smsAlerts: false,
      emergencyPush: true
    }
  }
};

export const initialRequests = [
  {
    id: 'req-1',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Emergency Hospital',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsNeeded: 2,
    urgency: 'CRITICAL', // CRITICAL, HIGH, NORMAL
    status: 'OPEN',      // OPEN, FULFILLED, CANCELLED, EXPIRED
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'ER-Bed-14 (Accident Trauma)',
    notes: 'Emergency transfusion needed immediately. Coagulation profile ready.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 7200000).toISOString(), // expires in 2 hours
    matchedCandidatesCount: 5,
    acceptedCount: 1
  },
  {
    id: 'req-2',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Emergency Hospital',
    bloodGroup: 'A+',
    bloodComponent: 'Packed Red Blood Cells',
    unitsNeeded: 3,
    urgency: 'HIGH',
    status: 'FULFILLED',
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'OT-02 (Cardio Bypass)',
    notes: 'Scheduled surgery requirement fulfilled by matched donors.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    expiresAt: new Date(Date.now() - 86400000).toISOString(),
    matchedCandidatesCount: 7,
    acceptedCount: 3
  },
  {
    id: 'req-3',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Emergency Hospital',
    bloodGroup: 'B-',
    bloodComponent: 'Platelets',
    unitsNeeded: 1,
    urgency: 'NORMAL',
    status: 'CANCELLED',
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'Ward 3B - Case #982',
    notes: 'Patient stabilized via hospital blood bank reserves.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    matchedCandidatesCount: 3,
    acceptedCount: 0
  },
  {
    id: 'req-4',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Emergency Hospital',
    bloodGroup: 'AB+',
    bloodComponent: 'Plasma',
    unitsNeeded: 1,
    urgency: 'HIGH',
    status: 'EXPIRED',
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'Burns ICU - Bed 3',
    notes: 'Request timeline elapsed.',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    matchedCandidatesCount: 4,
    acceptedCount: 0
  }
];

export const initialInvitations = [
  {
    id: 'inv-101',
    requestId: 'req-1',
    donorId: 'user-donor-1',
    hospitalName: 'City Care Emergency Hospital',
    hospitalAddress: 'Central Avenue, Sector 4, Mumbai',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsNeeded: 2,
    urgency: 'CRITICAL',
    distanceKm: 3.2,
    status: 'PENDING', // PENDING, ACCEPTED, DECLINED, EXPIRED
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 7200000).toISOString(),
    patientRef: 'ER-Bed-14 (Accident Trauma)'
  },
  {
    id: 'inv-102',
    requestId: 'req-4',
    donorId: 'user-donor-1',
    hospitalName: 'City Care Emergency Hospital',
    hospitalAddress: 'Central Avenue, Sector 4, Mumbai',
    bloodGroup: 'O+',
    bloodComponent: 'Plasma',
    unitsNeeded: 1,
    urgency: 'HIGH',
    distanceKm: 4.8,
    status: 'EXPIRED',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    patientRef: 'Burns ICU - Bed 3'
  }
];

export const initialRankedMatches = {
  'req-1': [
    {
      rank: 1,
      candidateId: 'cand-901',
      bloodGroup: 'O+',
      distanceKm: 2.1,
      approximateArea: 'Andheri West',
      eligibility: 'ELIGIBLE',
      responseStatus: 'ACCEPTED',
      responseTime: new Date(Date.now() - 1800000).toISOString()
    },
    {
      rank: 2,
      candidateId: 'user-donor-1', // Linked to user-donor-1
      bloodGroup: 'O+',
      distanceKm: 3.2,
      approximateArea: 'Andheri West',
      eligibility: 'ELIGIBLE',
      responseStatus: 'PENDING',
      responseTime: null
    },
    {
      rank: 3,
      candidateId: 'cand-903',
      bloodGroup: 'O-', // Universal donor compatibility
      distanceKm: 4.5,
      approximateArea: 'Vile Parle',
      eligibility: 'ELIGIBLE',
      responseStatus: 'PENDING',
      responseTime: null
    },
    {
      rank: 4,
      candidateId: 'cand-904',
      bloodGroup: 'O+',
      distanceKm: 6.8,
      approximateArea: 'Santacruz',
      eligibility: 'ELIGIBLE',
      responseStatus: 'DECLINED',
      responseTime: new Date(Date.now() - 900000).toISOString()
    }
  ],
  'req-2': [
    {
      rank: 1,
      candidateId: 'cand-801',
      bloodGroup: 'A+',
      distanceKm: 1.5,
      approximateArea: 'Bandra',
      eligibility: 'ELIGIBLE',
      responseStatus: 'ACCEPTED',
      responseTime: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      rank: 2,
      candidateId: 'cand-802',
      bloodGroup: 'A+',
      distanceKm: 2.8,
      approximateArea: 'Khar',
      eligibility: 'ELIGIBLE',
      responseStatus: 'ACCEPTED',
      responseTime: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      rank: 3,
      candidateId: 'cand-803',
      bloodGroup: 'A-',
      distanceKm: 3.9,
      approximateArea: 'Kurla',
      eligibility: 'ELIGIBLE',
      responseStatus: 'ACCEPTED',
      responseTime: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ]
};

export const initialDonationHistory = [
  {
    id: 'don-501',
    requestId: 'req-2',
    donorId: 'user-donor-1',
    hospitalName: 'City Care Emergency Hospital',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsDonated: 1,
    donatedAt: '2024-05-15T14:00:00Z',
    certificateId: 'CERT-2024-0515-O',
    notes: 'Voluntary replacement donation.'
  },
  {
    id: 'don-502',
    requestId: null,
    donorId: 'user-donor-1',
    hospitalName: 'Red Cross Regional Blood Center',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsDonated: 1,
    donatedAt: '2023-11-10T10:30:00Z',
    certificateId: 'CERT-2023-1110-O',
    notes: 'Community emergency drive.'
  }
];

export const initialPendingVerifications = [
  {
    id: 'ver-1',
    entityName: 'Apex Trauma & Critical Care',
    type: 'HOSPITAL',
    email: 'admin@apextrauma.org',
    licenseNumber: 'HOSP-MH-2026-4421',
    city: 'Mumbai',
    submittedAt: '2026-10-12T10:30:00Z',
    status: 'PENDING'
  },
  {
    id: 'ver-2',
    entityName: 'Dr. R. K. Blood Storage Centre',
    type: 'HOSPITAL',
    email: 'info@rkbloodcenter.org',
    licenseNumber: 'HOSP-MH-2025-1190',
    city: 'Pune',
    submittedAt: '2026-10-13T14:15:00Z',
    status: 'PENDING'
  },
  {
    id: 'ver-3',
    entityName: 'Dr. Sneha Roy (Emergency Coordinator)',
    type: 'STAFF',
    email: 'sneha.roy@metrohealth.org',
    licenseNumber: 'MED-REG-88912',
    city: 'Mumbai',
    submittedAt: '2026-10-14T07:45:00Z',
    status: 'PENDING'
  }
];

/**
 * In-Memory Mock Database Singleton Class
 */
class MockDatabase {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.donorProfiles = JSON.parse(JSON.stringify(initialDonorProfiles));
    this.requests = JSON.parse(JSON.stringify(initialRequests));
    this.invitations = JSON.parse(JSON.stringify(initialInvitations));
    this.rankedMatches = JSON.parse(JSON.stringify(initialRankedMatches));
    this.donationHistory = JSON.parse(JSON.stringify(initialDonationHistory));
    this.pendingVerifications = JSON.parse(JSON.stringify(initialPendingVerifications));
  }

  shouldSimulateRandomFailure() {
    // Check if user enabled random failure in localStorage or session
    if (typeof window !== 'undefined') {
      return localStorage.getItem('MOCK_SIMULATE_RANDOM_FAILURES') === 'true';
    }
    return false;
  }
}

export const db = new MockDatabase();
export default db;
