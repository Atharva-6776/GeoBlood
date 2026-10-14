/**
 * Synthetic Sample Data for Mock API
 * 
 * PRIVACY & SAFETY NOTE:
 * All names, locations, emails, and identifiers in this file are completely synthetic.
 * No real personal data or exact GPS coordinates of donors are exposed.
 */

export const mockUsers = [
  {
    id: 'user-donor-1',
    name: 'Aarav Sharma',
    email: 'donor@example.com',
    password: 'password123',
    role: 'DONOR'
  },
  {
    id: 'user-donor-2',
    name: 'Pooja Patel',
    email: 'pooja@example.com',
    password: 'password123',
    role: 'DONOR'
  },
  {
    id: 'user-hospital-1',
    name: 'City Care Hospital',
    email: 'hospital@example.com',
    password: 'password123',
    role: 'HOSPITAL',
    licenseNumber: 'HOSP-MUM-2024-981'
  },
  {
    id: 'user-admin-1',
    name: 'System Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'ADMIN'
  }
];

export const mockDonorProfiles = {
  'user-donor-1': {
    id: 'donor-1',
    userId: 'user-donor-1',
    name: 'Aarav Sharma',
    bloodGroup: 'O+',
    isAvailable: true,
    locationArea: 'Andheri West, Mumbai', // Broad neighborhood/district only, never exact home address
    contactNumber: '+91 98765 43210',
    lastDonationDate: '2024-05-15',
    eligibilityStatus: 'ELIGIBLE',
    totalDonations: 4
  },
  'user-donor-2': {
    id: 'donor-2',
    userId: 'user-donor-2',
    name: 'Pooja Patel',
    bloodGroup: 'A-',
    isAvailable: false,
    locationArea: 'Bandra East, Mumbai',
    contactNumber: '+91 98111 22334',
    lastDonationDate: '2024-07-20',
    eligibilityStatus: 'COOLDOWN_PERIOD', // Can't donate yet due to 90-day cooldown
    totalDonations: 2
  }
};

export const mockDonorInvitations = [
  {
    id: 'inv-101',
    requestId: 'req-1',
    hospitalName: 'City Care Hospital',
    hospitalAddress: 'Central Avenue, Sector 4, Mumbai',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsNeeded: 2,
    urgency: 'CRITICAL', // CRITICAL, HIGH, NORMAL
    distanceKm: 3.2,
    status: 'PENDING', // PENDING, ACCEPTED, DECLINED, EXPIRED
    createdAt: '2026-10-14T08:30:00Z',
    expiresAt: '2026-10-14T18:30:00Z',
    patientRef: 'Emergency Room - Bed 14'
  },
  {
    id: 'inv-102',
    requestId: 'req-2',
    hospitalName: 'Apex Trauma & Cardiac Centre',
    hospitalAddress: 'Ring Road, Sector 9, Mumbai',
    bloodGroup: 'O+',
    bloodComponent: 'Platelets',
    unitsNeeded: 1,
    urgency: 'HIGH',
    distanceKm: 6.8,
    status: 'ACCEPTED',
    createdAt: '2026-10-12T11:00:00Z',
    expiresAt: '2026-10-12T23:00:00Z',
    patientRef: 'Oncology Ward - Case #402'
  }
];

export const mockDonorDonationHistory = [
  {
    id: 'don-501',
    hospitalName: 'City Care Hospital',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsDonated: 1,
    donatedAt: '2024-05-15T14:00:00Z',
    certificateId: 'CERT-2024-0515-O',
    notes: 'Voluntary donation fulfilled safely.'
  },
  {
    id: 'don-502',
    hospitalName: 'Red Cross Regional Center',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsDonated: 1,
    donatedAt: '2023-11-10T10:30:00Z',
    certificateId: 'CERT-2023-1110-O',
    notes: 'Emergency replacement donation.'
  }
];

export const mockHospitalRequests = [
  {
    id: 'req-1',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Hospital',
    bloodGroup: 'O+',
    bloodComponent: 'Whole Blood',
    unitsNeeded: 2,
    urgency: 'CRITICAL',
    status: 'OPEN', // OPEN, FULFILLED, CANCELLED, EXPIRED
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'Emergency Room - Bed 14',
    notes: 'Accident trauma patient, immediate transfusion required.',
    createdAt: '2026-10-14T08:30:00Z',
    matchedCandidatesCount: 5,
    acceptedCount: 1
  },
  {
    id: 'req-2',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Hospital',
    bloodGroup: 'A+',
    bloodComponent: 'Packed Red Blood Cells',
    unitsNeeded: 3,
    urgency: 'HIGH',
    status: 'FULFILLED',
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'Surgical OT 2',
    notes: 'Scheduled bypass surgery requirement fulfilled.',
    createdAt: '2026-10-10T09:15:00Z',
    matchedCandidatesCount: 7,
    acceptedCount: 3
  },
  {
    id: 'req-3',
    hospitalId: 'user-hospital-1',
    hospitalName: 'City Care Hospital',
    bloodGroup: 'B-',
    bloodComponent: 'Platelets',
    unitsNeeded: 1,
    urgency: 'NORMAL',
    status: 'CANCELLED',
    hospitalLocation: 'Central Avenue, Sector 4, Mumbai',
    patientRef: 'Ward 3B - Case #982',
    notes: 'Patient stabilized from in-house blood inventory.',
    createdAt: '2026-10-08T14:00:00Z',
    matchedCandidatesCount: 3,
    acceptedCount: 0
  }
];

// Ranked matches returned by algorithm for request 'req-1'
// Note: Privacy enforced - no telephone numbers or street addresses!
export const mockRankedMatches = {
  'req-1': [
    {
      rank: 1,
      candidateId: 'cand-901',
      bloodGroup: 'O+',
      distanceKm: 2.1,
      approximateArea: 'Andheri West',
      eligibility: 'ELIGIBLE',
      responseStatus: 'ACCEPTED', // PENDING, ACCEPTED, DECLINED, EXPIRED
      responseTime: '2026-10-14T08:45:00Z'
    },
    {
      rank: 2,
      candidateId: 'cand-902',
      bloodGroup: 'O+',
      distanceKm: 3.2,
      approximateArea: 'Juhu',
      eligibility: 'ELIGIBLE',
      responseStatus: 'PENDING',
      responseTime: null
    },
    {
      rank: 3,
      candidateId: 'cand-903',
      bloodGroup: 'O-', // Compatible universal donor
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
      responseTime: '2026-10-14T09:00:00Z'
    }
  ]
};
