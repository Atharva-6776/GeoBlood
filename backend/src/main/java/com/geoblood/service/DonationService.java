package com.geoblood.service;

import com.geoblood.dto.DonationRecordRequest;
import com.geoblood.dto.DonationRecordResponse;
import com.geoblood.entity.BloodRequest;
import com.geoblood.entity.DonationRecord;
import com.geoblood.entity.DonorProfile;
import com.geoblood.entity.HospitalProfile;
import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.EligibilityStatus;
import com.geoblood.enums.RequestStatus;
import com.geoblood.exception.ResourceNotFoundException;
import com.geoblood.repository.BloodRequestRepository;
import com.geoblood.repository.DonationRecordRepository;
import com.geoblood.repository.DonorProfileRepository;
import com.geoblood.repository.HospitalProfileRepository;
import com.geoblood.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

@Service
public class DonationService {

    private final DonationRecordRepository donationRecordRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final HospitalProfileRepository hospitalProfileRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final AuditService auditService;

    public DonationService(DonationRecordRepository donationRecordRepository,
                           DonorProfileRepository donorProfileRepository,
                           HospitalProfileRepository hospitalProfileRepository,
                           BloodRequestRepository bloodRequestRepository,
                           AuditService auditService) {
        this.donationRecordRepository = donationRecordRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.auditService = auditService;
    }

    @Transactional
    public DonationRecordResponse recordDonation(UserPrincipal currentUser, DonationRecordRequest request) {
        // Find donor profile by donor ID or user ID
        DonorProfile donor = donorProfileRepository.findById(request.getDonorId())
                .or(() -> donorProfileRepository.findByUserId(request.getDonorId()))
                .orElseThrow(() -> new ResourceNotFoundException("Donor not found with reference: " + request.getDonorId()));

        // Find calling hospital profile if available
        Optional<HospitalProfile> hospitalOpt = hospitalProfileRepository.findByUserId(currentUser.getId());

        // Find blood request if provided
        Optional<BloodRequest> requestOpt = Optional.empty();
        if (request.getRequestId() != null) {
            requestOpt = bloodRequestRepository.findById(request.getRequestId());
        }

        String hospitalName = requestOpt.map(BloodRequest::getHospitalName)
                .orElseGet(() -> hospitalOpt.map(HospitalProfile::getFacilityName).orElse("General Hospital Blood Center"));

        BloodGroup bloodGroup = requestOpt.map(BloodRequest::getBloodGroup)
                .orElseGet(() -> donor.getBloodGroup() != null ? donor.getBloodGroup() : BloodGroup.O_POS);

        String bloodComponent = requestOpt.map(BloodRequest::getBloodComponent)
                .orElse("Whole Blood");

        Instant donatedAt = Instant.now();
        if (request.getDonatedAt() != null) {
            try {
                donatedAt = Instant.parse(request.getDonatedAt());
            } catch (Exception ignored) {
            }
        }

        String certificateId = String.format("CERT-%d-%s",
                System.currentTimeMillis() % 1000000,
                bloodGroup.getDisplayValue().replace("+", "P").replace("-", "N"));

        DonationRecord record = new DonationRecord(
                donor,
                hospitalOpt.orElse(null),
                hospitalName,
                request.getRequestId(),
                bloodGroup,
                bloodComponent,
                request.getUnitsDonated(),
                donatedAt,
                certificateId,
                request.getNotes() != null ? request.getNotes() : "Voluntary donation fulfilled safely.",
                currentUser.getName()
        );

        DonationRecord saved = donationRecordRepository.save(record);

        // Update donor stats and cooldown
        donor.setTotalDonations(donor.getTotalDonations() + request.getUnitsDonated());
        donor.setLastDonationDate(LocalDate.ofInstant(donatedAt, ZoneId.systemDefault()));
        donor.setEligibilityStatus(EligibilityStatus.COOLDOWN_PERIOD);
        donorProfileRepository.save(donor);

        // Update request status to FULFILLED if present
        requestOpt.ifPresent(br -> {
            br.setStatus(RequestStatus.FULFILLED);
            bloodRequestRepository.save(br);
        });

        auditService.log(
                currentUser.getId(),
                currentUser.getEmail(),
                "DONATION_RECORDED",
                "DonationRecord",
                String.valueOf(saved.getId()),
                "Recorded " + saved.getUnitsDonated() + " unit(s) donated by donor #" + donor.getId()
        );

        return new DonationRecordResponse(
                String.valueOf(saved.getId()),
                saved.getBloodRequestId() != null ? String.valueOf(saved.getBloodRequestId()) : null,
                String.valueOf(donor.getId()),
                saved.getHospitalName(),
                saved.getBloodGroup().getDisplayValue(),
                saved.getBloodComponent(),
                saved.getUnitsDonated(),
                saved.getDonatedAt().toString(),
                saved.getCertificateId(),
                saved.getNotes()
        );
    }
}
