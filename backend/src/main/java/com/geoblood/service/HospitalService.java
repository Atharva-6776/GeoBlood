package com.geoblood.service;

import com.geoblood.dto.HospitalProfileRequest;
import com.geoblood.dto.HospitalProfileResponse;
import com.geoblood.entity.HospitalProfile;
import com.geoblood.entity.User;
import com.geoblood.enums.VerificationStatus;
import com.geoblood.exception.ResourceNotFoundException;
import com.geoblood.repository.HospitalProfileRepository;
import com.geoblood.repository.UserRepository;
import com.geoblood.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class HospitalService {

    private final HospitalProfileRepository hospitalProfileRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public HospitalService(HospitalProfileRepository hospitalProfileRepository,
                           UserRepository userRepository,
                           AuditService auditService) {
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public HospitalProfileResponse getProfile(UserPrincipal currentUser) {
        HospitalProfile profile = hospitalProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    User user = userRepository.findById(currentUser.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUser.getId()));
                    HospitalProfile newProfile = new HospitalProfile(user, user.getName());
                    return hospitalProfileRepository.save(newProfile);
                });

        return toHospitalProfileResponse(profile);
    }

    @Transactional
    public HospitalProfileResponse createOrUpdateProfile(UserPrincipal currentUser, HospitalProfileRequest request) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUser.getId()));

        HospitalProfile profile = hospitalProfileRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> new HospitalProfile(user, request.getFacilityName()));

        profile.setFacilityName(request.getFacilityName().trim());
        if (StringUtils.hasText(request.getLicenseNumber())) {
            profile.setLicenseNumber(request.getLicenseNumber().trim());
        }
        profile.setAddress(request.getAddress().trim());
        profile.setLatitude(request.getLatitude());
        profile.setLongitude(request.getLongitude());
        profile.setContactPhone(request.getContactPhone().trim());
        if (StringUtils.hasText(request.getEmergencyHotline())) {
            profile.setEmergencyHotline(request.getEmergencyHotline().trim());
        }

        HospitalProfile saved = hospitalProfileRepository.save(profile);

        auditService.log(
                currentUser.getId(),
                currentUser.getEmail(),
                "HOSPITAL_PROFILE_UPDATED",
                "HospitalProfile",
                String.valueOf(saved.getId()),
                "Hospital profile updated for facility: " + saved.getFacilityName()
        );

        return toHospitalProfileResponse(saved);
    }

    @Transactional(readOnly = true)
    public HospitalProfileResponse getProfileById(Long id) {
        HospitalProfile profile = hospitalProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital profile not found with id: " + id));
        return toHospitalProfileResponse(profile);
    }

    private HospitalProfileResponse toHospitalProfileResponse(HospitalProfile profile) {
        return new HospitalProfileResponse(
                String.valueOf(profile.getId()),
                String.valueOf(profile.getUser().getId()),
                profile.getFacilityName(),
                profile.getLicenseNumber(),
                profile.getAddress(),
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getContactPhone(),
                profile.getEmergencyHotline(),
                profile.getVerificationStatus()
        );
    }
}
