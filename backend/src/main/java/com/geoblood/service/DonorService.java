package com.geoblood.service;

import com.geoblood.dto.*;
import com.geoblood.entity.BloodRequest;
import com.geoblood.entity.DonorProfile;
import com.geoblood.entity.RequestCandidate;
import com.geoblood.entity.User;
import com.geoblood.enums.EligibilityStatus;
import com.geoblood.exception.ResourceNotFoundException;
import com.geoblood.repository.DonationRecordRepository;
import com.geoblood.repository.DonorProfileRepository;
import com.geoblood.repository.RequestCandidateRepository;
import com.geoblood.repository.UserRepository;
import com.geoblood.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonorService {

    private final DonorProfileRepository donorProfileRepository;
    private final UserRepository userRepository;
    private final DonationRecordRepository donationRecordRepository;
    private final RequestCandidateRepository requestCandidateRepository;
    private final AuditService auditService;

    public DonorService(DonorProfileRepository donorProfileRepository,
                        UserRepository userRepository,
                        DonationRecordRepository donationRecordRepository,
                        RequestCandidateRepository requestCandidateRepository,
                        AuditService auditService) {
        this.donorProfileRepository = donorProfileRepository;
        this.userRepository = userRepository;
        this.donationRecordRepository = donationRecordRepository;
        this.requestCandidateRepository = requestCandidateRepository;
        this.auditService = auditService;
    }

    @Transactional
    public DonorProfileResponse getProfile(UserPrincipal currentUser) {
        DonorProfile profile = donorProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    User user = userRepository.findById(currentUser.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUser.getId()));
                    DonorProfile newProfile = new DonorProfile(user);
                    return donorProfileRepository.save(newProfile);
                });

        return toDonorProfileResponse(profile);
    }

    @Transactional
    public DonorProfileResponse createOrUpdateProfile(UserPrincipal currentUser, DonorProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUser.getId()));

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName().trim());
            userRepository.save(user);
        }

        DonorProfile profile = donorProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> new DonorProfile(user));

        profile.setBloodGroup(request.getBloodGroup());
        profile.setLocationArea(request.getLocationArea().trim());
        profile.setContactNumber(request.getContactNumber().trim());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());

        if (request.getNotificationPrefs() != null) {
            profile.setEmailAlerts(request.getNotificationPrefs().isEmailAlerts());
            profile.setSmsAlerts(request.getNotificationPrefs().isSmsAlerts());
            profile.setEmergencyPush(request.getNotificationPrefs().isEmergencyPush());
        }

        // If blood group and contact number are provided, set eligibility to ELIGIBLE
        if (profile.getBloodGroup() != null && StringUtils.hasText(profile.getContactNumber())) {
            if (profile.getEligibilityStatus() == EligibilityStatus.PROFILE_INCOMPLETE) {
                profile.setEligibilityStatus(EligibilityStatus.ELIGIBLE);
            }
        }

        DonorProfile savedProfile = donorProfileRepository.save(profile);

        auditService.log(
                currentUser.getId(),
                currentUser.getEmail(),
                "DONOR_PROFILE_UPDATED",
                "DonorProfile",
                String.valueOf(savedProfile.getId()),
                "Donor profile updated. Blood group: " + savedProfile.getBloodGroup()
        );

        return toDonorProfileResponse(savedProfile);
    }

    @Transactional
    public AvailabilityUpdateResponse updateAvailability(UserPrincipal currentUser, Boolean isAvailable) {
        DonorProfile profile = donorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + currentUser.getId()));

        profile.setAvailable(isAvailable);
        donorProfileRepository.save(profile);

        auditService.log(
                currentUser.getId(),
                currentUser.getEmail(),
                "DONOR_AVAILABILITY_CHANGED",
                "DonorProfile",
                String.valueOf(profile.getId()),
                "Availability changed to: " + isAvailable
        );

        String message = String.format("Donor is now marked as %s.",
                isAvailable ? "AVAILABLE for emergency requests" : "UNAVAILABLE");

        return new AvailabilityUpdateResponse(true, isAvailable, message);
    }

    @Transactional(readOnly = true)
    public List<DonationRecordResponse> getDonationHistory(UserPrincipal currentUser) {
        DonorProfile profile = donorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + currentUser.getId()));

        return donationRecordRepository.findByDonorIdOrderByDonatedAtDesc(profile.getId())
                .stream()
                .map(record -> new DonationRecordResponse(
                        String.valueOf(record.getId()),
                        record.getBloodRequestId() != null ? String.valueOf(record.getBloodRequestId()) : null,
                        String.valueOf(profile.getId()),
                        record.getHospitalName() != null ? record.getHospitalName() : "General Hospital Blood Center",
                        record.getBloodGroup() != null ? record.getBloodGroup().getDisplayValue() : null,
                        record.getBloodComponent() != null ? record.getBloodComponent() : "Whole Blood",
                        record.getUnitsDonated(),
                        record.getDonatedAt().toString(),
                        record.getCertificateId(),
                        record.getNotes()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DonorInvitationResponse> getInvitations(UserPrincipal currentUser) {
        DonorProfile profile = donorProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Donor profile not found for user: " + currentUser.getId()));

        List<RequestCandidate> candidates = requestCandidateRepository.findByDonorIdOrderByCreatedAtDesc(profile.getId());

        List<DonorInvitationResponse> responses = new ArrayList<>();
        for (RequestCandidate candidate : candidates) {
            BloodRequest request = candidate.getRequest();
            responses.add(new DonorInvitationResponse(
                    String.valueOf(candidate.getId()),
                    String.valueOf(request.getId()),
                    request.getHospitalName(),
                    request.getHospitalLocation(),
                    request.getBloodGroup().getDisplayValue(),
                    request.getBloodComponent(),
                    request.getUnitsNeeded(),
                    request.getUrgency().name(),
                    candidate.getDistanceKm(),
                    candidate.getResponseStatus().name(),
                    candidate.getCreatedAt().toString(),
                    request.getExpiresAt() != null ? request.getExpiresAt().toString() : null,
                    request.getPatientRef()
            ));
        }

        return responses;
    }

    private DonorProfileResponse toDonorProfileResponse(DonorProfile profile) {
        NotificationPrefsDto prefs = new NotificationPrefsDto(
                profile.isEmailAlerts(),
                profile.isSmsAlerts(),
                profile.isEmergencyPush()
        );

        return new DonorProfileResponse(
                String.valueOf(profile.getId()),
                String.valueOf(profile.getUser().getId()),
                profile.getUser().getName(),
                profile.getBloodGroup(),
                profile.isAvailable(),
                profile.getLocationArea() != null ? profile.getLocationArea() : "",
                profile.getContactNumber() != null ? profile.getContactNumber() : "",
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getLastDonationDate(),
                profile.getEligibilityStatus(),
                profile.getTotalDonations(),
                prefs
        );
    }
}
