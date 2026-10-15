package com.geoblood.repository;

import com.geoblood.entity.DonorProfile;
import com.geoblood.enums.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorProfileRepository extends JpaRepository<DonorProfile, Long> {

    Optional<DonorProfile> findByUserId(Long userId);

    List<DonorProfile> findByIsAvailableTrue();

    List<DonorProfile> findByBloodGroup(BloodGroup bloodGroup);

    List<DonorProfile> findByBloodGroupAndIsAvailableTrue(BloodGroup bloodGroup);

    boolean existsByUserId(Long userId);
}
