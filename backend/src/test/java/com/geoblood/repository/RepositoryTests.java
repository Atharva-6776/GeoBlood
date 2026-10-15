package com.geoblood.repository;

import com.geoblood.entity.DonationRecord;
import com.geoblood.entity.DonorProfile;
import com.geoblood.entity.HospitalProfile;
import com.geoblood.entity.User;
import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.EligibilityStatus;
import com.geoblood.enums.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class RepositoryTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonorProfileRepository donorProfileRepository;

    @Autowired
    private HospitalProfileRepository hospitalProfileRepository;

    @Autowired
    private DonationRecordRepository donationRecordRepository;

    @Test
    @DisplayName("User persistence and lookup by email works")
    void testUserPersistence() {
        User user = new User("Rahul Verma", "rahul@example.com", "+91 99887 76655", "hash123", Role.DONOR, true);
        User saved = userRepository.save(user);

        assertNotNull(saved.getId());
        Optional<User> found = userRepository.findByEmailIgnoreCase("RAHUL@EXAMPLE.COM");
        assertTrue(found.isPresent());
        assertEquals("Rahul Verma", found.get().getName());
        assertEquals(Role.DONOR, found.get().getRole());
    }

    @Test
    @DisplayName("DonorProfile persistence and queries work")
    void testDonorProfilePersistence() {
        User user = new User("Sneha Roy", "sneha@example.com", "+91 91234 56789", "hash123", Role.DONOR, true);
        User savedUser = userRepository.save(user);

        DonorProfile profile = new DonorProfile(savedUser);
        profile.setBloodGroup(BloodGroup.O_NEG);
        profile.setLocationArea("Pune Central");
        profile.setContactNumber("+91 91234 56789");
        profile.setLatitude(18.5204);
        profile.setLongitude(73.8567);
        profile.setAvailable(true);
        profile.setEligibilityStatus(EligibilityStatus.ELIGIBLE);
        DonorProfile savedProfile = donorProfileRepository.save(profile);

        assertNotNull(savedProfile.getId());
        assertEquals(BloodGroup.O_NEG, savedProfile.getBloodGroup());

        List<DonorProfile> available = donorProfileRepository.findByIsAvailableTrue();
        assertFalse(available.isEmpty());

        List<DonorProfile> oNeg = donorProfileRepository.findByBloodGroup(BloodGroup.O_NEG);
        assertFalse(oNeg.isEmpty());
        assertEquals("Sneha Roy", oNeg.get(0).getUser().getName());
    }

    @Test
    @DisplayName("HospitalProfile persistence works")
    void testHospitalProfilePersistence() {
        User user = new User("Metro Health", "metro@example.com", "+91 20 2567 8900", "hash123", Role.HOSPITAL, true);
        User savedUser = userRepository.save(user);

        HospitalProfile hosp = new HospitalProfile(savedUser, "Metro Health Clinic");
        hosp.setLicenseNumber("LIC-MH-2024-001");
        hosp.setAddress("FC Road, Pune");
        hosp.setContactPhone("+91 20 2567 8900");
        hosp.setLatitude(18.5204);
        hosp.setLongitude(73.8567);
        HospitalProfile saved = hospitalProfileRepository.save(hosp);

        assertNotNull(saved.getId());
        Optional<HospitalProfile> found = hospitalProfileRepository.findByUserId(savedUser.getId());
        assertTrue(found.isPresent());
        assertEquals("Metro Health Clinic", found.get().getFacilityName());
    }

    @Test
    @DisplayName("DonationRecord persistence and history retrieval works")
    void testDonationRecordPersistence() {
        User user = new User("Kiran Rao", "kiran@example.com", "+91 98765 00000", "hash123", Role.DONOR, true);
        User savedUser = userRepository.save(user);

        DonorProfile profile = new DonorProfile(savedUser);
        profile.setBloodGroup(BloodGroup.B_POS);
        profile.setContactNumber("+91 98765 00000");
        DonorProfile savedProfile = donorProfileRepository.save(profile);

        DonationRecord record = new DonationRecord(
                savedProfile,
                null,
                "Apex Clinic",
                null,
                BloodGroup.B_POS,
                "Whole Blood",
                1,
                Instant.now(),
                "CERT-TEST-B1",
                "Routine voluntary donation",
                "Nurse A"
        );
        donationRecordRepository.save(record);

        List<DonationRecord> history = donationRecordRepository.findByDonorIdOrderByDonatedAtDesc(savedProfile.getId());
        assertEquals(1, history.size());
        assertEquals("CERT-TEST-B1", history.get(0).getCertificateId());
        assertEquals(BloodGroup.B_POS, history.get(0).getBloodGroup());
    }
}
