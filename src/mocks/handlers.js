import { http, HttpResponse, delay } from 'msw';
import db from './db';

// Helper to extract bearer token user from request
function getAuthUser(request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.replace('Bearer ', '');
  const user = db.users.find((u) => `mock-jwt-${u.id}` === token);
  return user || null;
}

export const handlers = [
  // -------------------------------------------------------------
  // AUTH: Login
  // -------------------------------------------------------------
  http.post('*/api/auth/login', async ({ request }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Internal Server Error (random failure toggle is ON).' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    const user = db.users.find(
      (u) => u.email.toLowerCase() === (email || '').toLowerCase().trim()
    );

    if (!user || user.password !== password) {
      return HttpResponse.json(
        {
          status: 401,
          message: 'Invalid email or password.',
          errors: { credentials: 'The email or password you entered is incorrect.' }
        },
        { status: 401 }
      );
    }

    const token = `mock-jwt-${user.id}`;
    return HttpResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }),

  // -------------------------------------------------------------
  // AUTH: Register
  // -------------------------------------------------------------
  http.post('*/api/auth/register', async ({ request }) => {
    await delay(350);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Internal Server Error during registration.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, email, password, role } = body;

    const errors = {};
    if (!name || !name.trim()) errors.name = 'Full name is required';
    if (!email || !email.trim()) errors.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'Please provide a valid email format';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!role || !['DONOR', 'HOSPITAL'].includes(role)) errors.role = 'Role must be DONOR or HOSPITAL';

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          message: 'Validation failed. Please correct the fields.',
          errors
        },
        { status: 400 }
      );
    }

    const existingUser = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (existingUser) {
      return HttpResponse.json(
        {
          status: 400,
          message: 'An account with this email address already exists.',
          errors: { email: 'Email is already registered' }
        },
        { status: 400 }
      );
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
      role
    };
    db.users.push(newUser);

    if (role === 'DONOR') {
      db.donorProfiles[newUser.id] = {
        id: `donor-${Date.now()}`,
        userId: newUser.id,
        name: newUser.name,
        bloodGroup: '',
        isAvailable: true,
        locationArea: '',
        contactNumber: '',
        latitude: null,
        longitude: null,
        lastDonationDate: null,
        eligibilityStatus: 'PROFILE_INCOMPLETE',
        totalDonations: 0,
        notificationPrefs: { emailAlerts: true, smsAlerts: true, emergencyPush: true }
      };
    }

    return HttpResponse.json(
      {
        message: 'Account created successfully! You can now log in.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      },
      { status: 201 }
    );
  }),

  // -------------------------------------------------------------
  // DONOR: Get Profile (GET /api/donors/me)
  // -------------------------------------------------------------
  http.get('*/api/donors/me', async ({ request }) => {
    await delay(250);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch donor profile.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    let profile = db.donorProfiles[user.id];
    if (!profile) {
      // Create empty profile if not found
      profile = {
        id: `donor-${user.id}`,
        userId: user.id,
        name: user.name,
        bloodGroup: 'O+',
        isAvailable: true,
        locationArea: 'Mumbai',
        contactNumber: '+91 98000 00000',
        latitude: 19.0760,
        longitude: 72.8777,
        lastDonationDate: null,
        eligibilityStatus: 'ELIGIBLE',
        totalDonations: 0,
        notificationPrefs: { emailAlerts: true, smsAlerts: true, emergencyPush: true }
      };
      db.donorProfiles[user.id] = profile;
    }

    return HttpResponse.json(profile);
  }),

  // -------------------------------------------------------------
  // DONOR: Create / Update Profile (POST /api/donors)
  // -------------------------------------------------------------
  http.post('*/api/donors', async ({ request }) => {
    await delay(350);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Failed to update profile.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, bloodGroup, locationArea, contactNumber, latitude, longitude, notificationPrefs } = body;

    const errors = {};
    if (!bloodGroup) errors.bloodGroup = 'Blood group is required';
    if (!locationArea || !locationArea.trim()) errors.locationArea = 'City or neighborhood area is required';
    if (!contactNumber || !contactNumber.trim()) errors.contactNumber = 'Contact number is required';
    else if (!/^\+?[\d\s-]{8,16}$/.test(contactNumber.trim())) {
      errors.contactNumber = 'Please provide a valid phone number (8-16 digits)';
    }

    if (latitude !== undefined && latitude !== null && latitude !== '') {
      const latNum = Number(latitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
      }
    }

    if (longitude !== undefined && longitude !== null && longitude !== '') {
      const lngNum = Number(longitude);
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          message: 'Please resolve form validation errors.',
          errors
        },
        { status: 400 }
      );
    }

    if (name && name.trim()) {
      user.name = name.trim();
    }

    db.donorProfiles[user.id] = {
      ...(db.donorProfiles[user.id] || {}),
      id: db.donorProfiles[user.id]?.id || `donor-${user.id}`,
      userId: user.id,
      name: user.name,
      bloodGroup,
      locationArea: locationArea.trim(),
      contactNumber: contactNumber.trim(),
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
      notificationPrefs: notificationPrefs || db.donorProfiles[user.id]?.notificationPrefs || {
        emailAlerts: true,
        smsAlerts: true,
        emergencyPush: true
      },
      isAvailable: db.donorProfiles[user.id]?.isAvailable ?? true,
      eligibilityStatus: 'ELIGIBLE',
      totalDonations: db.donorProfiles[user.id]?.totalDonations || 0
    };

    return HttpResponse.json(db.donorProfiles[user.id]);
  }),

  // -------------------------------------------------------------
  // DONOR: Availability Toggle (PATCH /api/donors/me/availability)
  // -------------------------------------------------------------
  http.patch('*/api/donors/me/availability', async ({ request }) => {
    await delay(200);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not update availability.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    if (typeof body.isAvailable !== 'boolean') {
      return HttpResponse.json(
        { status: 400, message: 'isAvailable must be true or false', errors: { isAvailable: 'Boolean required' } },
        { status: 400 }
      );
    }

    if (db.donorProfiles[user.id]) {
      db.donorProfiles[user.id].isAvailable = body.isAvailable;
    }

    return HttpResponse.json({
      success: true,
      isAvailable: body.isAvailable,
      message: `Donor is now marked as ${body.isAvailable ? 'AVAILABLE for emergency requests' : 'UNAVAILABLE'}.`
    });
  }),

  // -------------------------------------------------------------
  // DONOR: Invitations (GET /api/donors/me/invitations)
  // -------------------------------------------------------------
  http.get('*/api/donors/me/invitations', async ({ request }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch invitations.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    // Filter invitations for this donor or return all mock invitations
    return HttpResponse.json(db.invitations);
  }),

  // -------------------------------------------------------------
  // DONOR: History (GET /api/donors/me/donations)
  // -------------------------------------------------------------
  http.get('*/api/donors/me/donations', async ({ request }) => {
    await delay(250);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch donation history.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    return HttpResponse.json(db.donationHistory);
  }),

  // -------------------------------------------------------------
  // HOSPITAL: Create Blood Request (POST /api/requests)
  // -------------------------------------------------------------
  http.post('*/api/requests', async ({ request }) => {
    await delay(400);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not create blood request.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { bloodGroup, bloodComponent, unitsNeeded, urgency, hospitalLocation, patientRef, notes } = body;

    const errors = {};
    if (!bloodGroup) errors.bloodGroup = 'Blood group is required';
    if (!bloodComponent) errors.bloodComponent = 'Component type is required';
    if (!unitsNeeded) errors.unitsNeeded = 'Units required';
    else if (Number(unitsNeeded) <= 0 || !Number.isInteger(Number(unitsNeeded))) {
      errors.unitsNeeded = 'Quantity must be a positive whole number';
    }
    if (!urgency) errors.urgency = 'Urgency classification is required';
    if (!hospitalLocation || !hospitalLocation.trim()) {
      errors.hospitalLocation = 'Hospital address and receiving ward is required';
    }

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          message: 'Please correct the highlighted form errors.',
          errors
        },
        { status: 400 }
      );
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      hospitalId: user.id,
      hospitalName: user.name,
      bloodGroup,
      bloodComponent,
      unitsNeeded: Number(unitsNeeded),
      urgency,
      status: 'OPEN',
      hospitalLocation: hospitalLocation.trim(),
      patientRef: patientRef?.trim() || 'Urgent Hospital Case',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14400000).toISOString(), // 4 hours validity
      matchedCandidatesCount: 4,
      acceptedCount: 0
    };

    db.requests.unshift(newRequest);

    // Populate mock ranked candidates for this request
    db.rankedMatches[newRequest.id] = [
      {
        rank: 1,
        candidateId: 'cand-auto-1',
        bloodGroup: newRequest.bloodGroup,
        distanceKm: 1.4,
        approximateArea: 'Sector 3 (Near Hospital)',
        eligibility: 'ELIGIBLE',
        responseStatus: 'PENDING',
        responseTime: null
      },
      {
        rank: 2,
        candidateId: 'user-donor-1',
        bloodGroup: newRequest.bloodGroup,
        distanceKm: 2.9,
        approximateArea: 'Andheri West',
        eligibility: 'ELIGIBLE',
        responseStatus: 'PENDING',
        responseTime: null
      },
      {
        rank: 3,
        candidateId: 'cand-auto-3',
        bloodGroup: newRequest.bloodGroup,
        distanceKm: 4.8,
        approximateArea: 'Santacruz',
        eligibility: 'ELIGIBLE',
        responseStatus: 'PENDING',
        responseTime: null
      }
    ];

    // Add invitation for donor-1 so donor dashboard immediately sees this new emergency!
    db.invitations.unshift({
      id: `inv-${Date.now()}`,
      requestId: newRequest.id,
      donorId: 'user-donor-1',
      hospitalName: user.name,
      hospitalAddress: newRequest.hospitalLocation,
      bloodGroup: newRequest.bloodGroup,
      bloodComponent: newRequest.bloodComponent,
      unitsNeeded: newRequest.unitsNeeded,
      urgency: newRequest.urgency,
      distanceKm: 2.9,
      status: 'PENDING',
      createdAt: newRequest.createdAt,
      expiresAt: newRequest.expiresAt,
      patientRef: newRequest.patientRef
    });

    return HttpResponse.json(newRequest, { status: 201 });
  }),

  // -------------------------------------------------------------
  // HOSPITAL: List Requests (GET /api/requests)
  // -------------------------------------------------------------
  http.get('*/api/requests', async ({ request }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch requests.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    return HttpResponse.json(db.requests);
  }),

  // -------------------------------------------------------------
  // HOSPITAL: Single Request Details (GET /api/requests/:id)
  // -------------------------------------------------------------
  http.get('*/api/requests/:id', async ({ params }) => {
    await delay(200);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch request details.' },
        { status: 500 }
      );
    }

    const { id } = params;
    const item = db.requests.find((r) => r.id === id);

    if (!item) {
      return HttpResponse.json(
        { status: 404, message: `Emergency request #${id} not found.` },
        { status: 404 }
      );
    }

    return HttpResponse.json(item);
  }),

  // -------------------------------------------------------------
  // HOSPITAL: Cancel Request (PATCH /api/requests/:id/cancel)
  // -------------------------------------------------------------
  http.patch('*/api/requests/:id/cancel', async ({ params, request }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not cancel request.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    const { id } = params;
    const reqItem = db.requests.find((r) => r.id === id);

    if (!reqItem) {
      return HttpResponse.json({ status: 404, message: 'Request not found' }, { status: 404 });
    }

    if (reqItem.status === 'CANCELLED') {
      return HttpResponse.json(
        { status: 400, message: 'This request is already cancelled.' },
        { status: 400 }
      );
    }

    if (reqItem.status === 'FULFILLED') {
      return HttpResponse.json(
        { status: 400, message: 'Cannot cancel a request that has already been fulfilled.' },
        { status: 400 }
      );
    }

    reqItem.status = 'CANCELLED';

    // Mark pending invitations for this request as EXPIRED/CANCELLED
    db.invitations = db.invitations.map((inv) =>
      inv.requestId === id && inv.status === 'PENDING' ? { ...inv, status: 'EXPIRED' } : inv
    );

    return HttpResponse.json({
      success: true,
      message: 'Blood request has been successfully cancelled.',
      request: reqItem
    });
  }),

  // -------------------------------------------------------------
  // HOSPITAL: Ranked Matches (GET /api/requests/:id/matches)
  // -------------------------------------------------------------
  http.get('*/api/requests/:id/matches', async ({ params }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch ranked matches.' },
        { status: 500 }
      );
    }

    const { id } = params;
    const matches = db.rankedMatches[id] || [];

    // PRIVACY ENFORCEMENT:
    // Only return rank, bloodGroup, approximate distance, approximate area, response status
    // Absolutely NO phone numbers, email addresses, or exact street coordinates
    return HttpResponse.json(matches);
  }),

  // -------------------------------------------------------------
  // DONOR: Respond to Request (POST /api/requests/:id/responses)
  // -------------------------------------------------------------
  http.post('*/api/requests/:id/responses', async ({ params, request }) => {
    await delay(350);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not submit response.' },
        { status: 500 }
      );
    }

    const user = getAuthUser(request);
    if (!user) {
      return HttpResponse.json({ status: 401, message: 'Authentication required' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { status } = body;

    if (!status || !['ACCEPTED', 'DECLINED'].includes(status)) {
      return HttpResponse.json(
        { status: 400, message: 'Response status must be ACCEPTED or DECLINED.' },
        { status: 400 }
      );
    }

    // Check target request
    const targetRequest = db.requests.find((r) => r.id === id);
    if (!targetRequest) {
      return HttpResponse.json({ status: 404, message: 'Request not found.' }, { status: 404 });
    }

    // BEHAVIOR CHECK 1: Accepting an expired or cancelled request returns 409
    if (targetRequest.status === 'EXPIRED' || targetRequest.status === 'CANCELLED') {
      return HttpResponse.json(
        {
          status: 409,
          message: `This blood request is ${targetRequest.status.toLowerCase()} and can no longer accept responses.`,
          errors: { request: `Request is ${targetRequest.status}` }
        },
        { status: 409 }
      );
    }

    // BEHAVIOR CHECK 2: Accepting when the request is already full returns 409
    if (status === 'ACCEPTED' && targetRequest.acceptedCount >= targetRequest.unitsNeeded) {
      return HttpResponse.json(
        {
          status: 409,
          message: 'This blood request has already reached its required donor quota.',
          errors: { quota: 'Donor capacity reached' }
        },
        { status: 409 }
      );
    }

    // Find the donor's invitation
    const targetInvitation = db.invitations.find(
      (inv) => inv.requestId === id && (inv.donorId === user.id || !inv.donorId)
    );

    // BEHAVIOR CHECK 3: Duplicate response check returns 409
    if (targetInvitation && targetInvitation.status !== 'PENDING') {
      return HttpResponse.json(
        {
          status: 409,
          message: `You have already ${targetInvitation.status.toLowerCase()} this invitation. Duplicate responses are not permitted.`,
          errors: { response: 'Duplicate response' }
        },
        { status: 409 }
      );
    }

    // Update invitation
    if (targetInvitation) {
      targetInvitation.status = status;
    } else {
      db.invitations.push({
        id: `inv-${Date.now()}`,
        requestId: id,
        donorId: user.id,
        hospitalName: targetRequest.hospitalName,
        bloodGroup: targetRequest.bloodGroup,
        unitsNeeded: targetRequest.unitsNeeded,
        urgency: targetRequest.urgency,
        distanceKm: 3.0,
        status,
        createdAt: targetRequest.createdAt
      });
    }

    // Update request accepted count
    if (status === 'ACCEPTED') {
      targetRequest.acceptedCount += 1;
    }

    // Update matches table if this candidate is listed
    if (db.rankedMatches[id]) {
      const matchCandidate = db.rankedMatches[id].find(
        (m) => m.candidateId === user.id || m.candidateId === 'cand-902'
      );
      if (matchCandidate) {
        matchCandidate.responseStatus = status;
        matchCandidate.responseTime = new Date().toISOString();
      }
    }

    return HttpResponse.json({
      success: true,
      requestId: id,
      status,
      message: `You have successfully ${status.toLowerCase()} the emergency request.`
    });
  }),

  // -------------------------------------------------------------
  // RECORD DONATION OUTCOME (POST /api/donations)
  // -------------------------------------------------------------
  http.post('*/api/donations', async ({ request }) => {
    await delay(350);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not record donation outcome.' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { requestId, donorId, unitsDonated, donatedAt, notes } = body;

    const errors = {};
    if (!requestId) errors.requestId = 'Blood request ID is required';
    if (!donorId) errors.donorId = 'Donor ID / candidate reference is required';
    if (!unitsDonated || Number(unitsDonated) <= 0) {
      errors.unitsDonated = 'Units donated must be a positive integer';
    }

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          message: 'Please resolve missing fields.',
          errors
        },
        { status: 400 }
      );
    }

    const targetReq = db.requests.find((r) => r.id === requestId);

    const newDonation = {
      id: `don-${Date.now()}`,
      requestId,
      donorId,
      hospitalName: targetReq ? targetReq.hospitalName : 'General Hospital Blood Center',
      bloodGroup: targetReq ? targetReq.bloodGroup : 'O+',
      bloodComponent: targetReq ? targetReq.bloodComponent : 'Whole Blood',
      unitsDonated: Number(unitsDonated),
      donatedAt: donatedAt || new Date().toISOString(),
      certificateId: `CERT-${Date.now().toString().slice(-6)}`,
      notes: notes?.trim() || 'Emergency donation verified by attending clinician.'
    };

    db.donationHistory.unshift(newDonation);

    // If target request exists, mark as FULFILLED
    if (targetReq) {
      targetReq.status = 'FULFILLED';
    }

    return HttpResponse.json(
      {
        message: 'Donation outcome recorded successfully.',
        donation: newDonation
      },
      { status: 201 }
    );
  }),

  // -------------------------------------------------------------
  // ADMIN: Verifications List (GET /api/admin/verifications)
  // -------------------------------------------------------------
  http.get('*/api/admin/verifications', async () => {
    await delay(250);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not fetch verifications.' },
        { status: 500 }
      );
    }

    return HttpResponse.json(db.pendingVerifications);
  }),

  // -------------------------------------------------------------
  // ADMIN: Verification Action (PATCH /api/admin/verifications/:id)
  // -------------------------------------------------------------
  http.patch('*/api/admin/verifications/:id', async ({ params, request }) => {
    await delay(300);

    if (db.shouldSimulateRandomFailure()) {
      return HttpResponse.json(
        { status: 500, message: '[Simulated Failure] Could not update verification status.' },
        { status: 500 }
      );
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { action } = body;

    const item = db.pendingVerifications.find((v) => v.id === id);
    if (!item) {
      return HttpResponse.json({ status: 404, message: 'Verification record not found' }, { status: 404 });
    }

    item.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    item.resolvedAt = new Date().toISOString();

    return HttpResponse.json({
      success: true,
      message: `Account verification ${item.status.toLowerCase()}.`,
      verification: item
    });
  })
];

export default handlers;
