package com.geoblood.repository;

import com.geoblood.entity.BloodRequest;
import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {

    List<BloodRequest> findByHospitalIdOrderByCreatedAtDesc(Long hospitalId);

    List<BloodRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    List<BloodRequest> findByBloodGroupAndStatus(BloodGroup bloodGroup, RequestStatus status);
}
