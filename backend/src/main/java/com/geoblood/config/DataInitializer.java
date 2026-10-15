package com.geoblood.config;

import com.geoblood.entity.*;
import com.geoblood.enums.*;
import com.geoblood.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DonorProfileRepository donorProfileRepository;
    private final HospitalProfileRepository hospitalProfileRepository;
    private final DonationRecordRepository donationRecordRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final RequestCandidateRepository requestCandidateRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DonorProfileRepository donorProfileRepository,
                           HospitalProfileRepository hospitalProfileRepository,
                           DonationRecordRepository donationRecordRepository,
                           BloodRequestRepository bloodRequestRepository,
                           RequestCandidateRepository requestCandidateRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.donorProfileRepository = donorProfileRepository;
        this.hospitalProfileRepository = hospitalProfileRepository;
        this.donationRecordRepository = donationRecordRepository;
        this.bloodRequestRepository = bloodRequestRepository;
        this.requestCandidateRepository = requestCandidateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with user records. Skipping initializer.");
            return;
        }

        logger.info("Initializing synthetic sample data for GeoBlood Link...");

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Donor 1 (Aarav Sharma - donor@test.com / donor@example.com)
        User donorUser1 = new User("Aarav Sharma", "donor@test.com", "+91 98765 43210", defaultPass, Role.DONOR, true);
        userRepository.save(donorUser1);

        DonorProfile donorProfile1 = new DonorProfile(donorUser1);
        donorProfile1.setBloodGroup(BloodGroup.O_POS);
        donorProfile1.setAvailable(true);
        donorProfile1.setLocationArea("Andheri West, Mumbai");
        donorProfile1.setContactNumber("+91 98765 43210");
        donorProfile1.setLatitude(19.1136);
        donorProfile1.setLongitude(72.8697);
        donorProfile1.setLastDonationDate(LocalDate.now().minusDays(150));
        donorProfile1.setEligibilityStatus(EligibilityStatus.ELIGIBLE);
        donorProfile1.setTotalDonations(4);
        donorProfileRepository.save(donorProfile1);

        // Alias account matching frontend mock data.js: donor@example.com
        User donorUserAlias = new User("Aarav Sharma", "donor@example.com", "+91 98765 43210", defaultPass, Role.DONOR, true);
        userRepository.save(donorUserAlias);
        DonorProfile donorProfileAlias = new DonorProfile(donorUserAlias);
        donorProfileAlias.setBloodGroup(BloodGroup.O_POS);
        donorProfileAlias.setAvailable(true);
        donorProfileAlias.setLocationArea("Andheri West, Mumbai");
        donorProfileAlias.setContactNumber("+91 98765 43210");
        donorProfileAlias.setLatitude(19.1136);
        donorProfileAlias.setLongitude(72.8697);
        donorProfileAlias.setLastDonationDate(LocalDate.now().minusDays(150));
        donorProfileAlias.setEligibilityStatus(EligibilityStatus.ELIGIBLE);
        donorProfileAlias.setTotalDonations(4);
        donorProfileRepository.save(donorProfileAlias);

        // 2. Donor 2 (Pooja Patel - pooja@example.com)
        User donorUser2 = new User("Pooja Patel", "pooja@example.com", "+91 98111 22334", defaultPass, Role.DONOR, true);
        userRepository.save(donorUser2);

        DonorProfile donorProfile2 = new DonorProfile(donorUser2);
        donorProfile2.setBloodGroup(BloodGroup.A_NEG);
        donorProfile2.setAvailable(false);
        donorProfile2.setLocationArea("Bandra East, Mumbai");
        donorProfile2.setContactNumber("+91 98111 22334");
        donorProfile2.setLatitude(19.0596);
        donorProfile2.setLongitude(72.8295);
        donorProfile2.setLastDonationDate(LocalDate.now().minusDays(40));
        donorProfile2.setEligibilityStatus(EligibilityStatus.COOLDOWN_PERIOD);
        donorProfile2.setTotalDonations(2);
        donorProfileRepository.save(donorProfile2);

        // 3. Hospital (City Care Hospital - hospital@test.com / hospital@example.com)
        User hospitalUser = new User("City Care Hospital", "hospital@test.com", "+91 22 2847 0000", defaultPass, Role.HOSPITAL, true);
        userRepository.save(hospitalUser);

        HospitalProfile hospitalProfile = new HospitalProfile(hospitalUser, "City Care Hospital");
        hospitalProfile.setLicenseNumber("HOSP-MUM-2024-981");
        hospitalProfile.setAddress("Central Avenue, Sector 4, Mumbai");
        hospitalProfile.setLatitude(19.0760);
        hospitalProfile.setLongitude(72.8777);
        hospitalProfile.setContactPhone("+91 22 2847 0000");
        hospitalProfile.setEmergencyHotline("+91 98200 11223");
        hospitalProfile.setVerificationStatus(VerificationStatus.APPROVED);
        hospitalProfileRepository.save(hospitalProfile);

        User hospitalUserAlias = new User("City Care Hospital", "hospital@example.com", "+91 22 2847 0000", defaultPass, Role.HOSPITAL, true);
        userRepository.save(hospitalUserAlias);
        HospitalProfile hospitalProfileAlias = new HospitalProfile(hospitalUserAlias, "City Care Hospital");
        hospitalProfileAlias.setLicenseNumber("HOSP-MUM-2024-981");
        hospitalProfileAlias.setAddress("Central Avenue, Sector 4, Mumbai");
        hospitalProfileAlias.setLatitude(19.0760);
        hospitalProfileAlias.setLongitude(72.8777);
        hospitalProfileAlias.setContactPhone("+91 22 2847 0000");
        hospitalProfileAlias.setEmergencyHotline("+91 98200 11223");
        hospitalProfileAlias.setVerificationStatus(VerificationStatus.APPROVED);
        hospitalProfileRepository.save(hospitalProfileAlias);

        // 4. Admin (admin@test.com / admin@example.com)
        User adminUser = new User("System Admin", "admin@test.com", "+91 99999 88888", defaultPass, Role.ADMIN, true);
        userRepository.save(adminUser);

        User adminUserAlias = new User("System Admin", "admin@example.com", "+91 99999 88888", defaultPass, Role.ADMIN, true);
        userRepository.save(adminUserAlias);

        // 5. Seed Past Donation Records for Donor 1
        DonationRecord don1 = new DonationRecord(
                donorProfile1,
                hospitalProfile,
                "City Care Hospital",
                null,
                BloodGroup.O_POS,
                "Whole Blood",
                1,
                Instant.now().minus(150, ChronoUnit.DAYS),
                "CERT-2024-0515-O",
                "Voluntary donation fulfilled safely.",
                "Dr. S. Mehta"
        );
        donationRecordRepository.save(don1);

        DonationRecord don2 = new DonationRecord(
                donorProfile1,
                null,
                "Red Cross Regional Center",
                null,
                BloodGroup.O_POS,
                "Whole Blood",
                1,
                Instant.now().minus(330, ChronoUnit.DAYS),
                "CERT-2023-1110-O",
                "Emergency replacement donation.",
                "Dr. A. Rao"
        );
        donationRecordRepository.save(don2);

        // 6. Seed Sample Emergency Blood Request
        BloodRequest req1 = new BloodRequest(
                hospitalProfile,
                "City Care Hospital",
                BloodGroup.O_POS,
                "Whole Blood",
                2,
                Urgency.CRITICAL,
                "Central Avenue, Sector 4, Mumbai",
                "Emergency Room - Bed 14",
                "Accident trauma patient, immediate transfusion required."
        );
        req1.setAcceptedCount(1);
        req1.setMatchedCandidatesCount(3);
        bloodRequestRepository.save(req1);

        // 7. Seed Request Candidate Invitation for Donor 1
        RequestCandidate candidate1 = new RequestCandidate(
                req1,
                donorProfile1,
                1,
                2.9,
                "Andheri West"
        );
        candidate1.setResponseStatus(CandidateResponseStatus.PENDING);
        requestCandidateRepository.save(candidate1);

        logger.info("Successfully seeded synthetic demo accounts: donor@test.com, hospital@test.com, admin@test.com (password: password123)");
    }
}
