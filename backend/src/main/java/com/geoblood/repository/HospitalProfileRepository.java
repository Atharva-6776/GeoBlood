package com.geoblood.repository;

import com.geoblood.entity.HospitalProfile;
import com.geoblood.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalProfileRepository extends JpaRepository<HospitalProfile, Long> {

    Optional<HospitalProfile> findByUserId(Long userId);

    List<HospitalProfile> findByVerificationStatus(VerificationStatus verificationStatus);

    boolean existsByUserId(Long userId);
}
