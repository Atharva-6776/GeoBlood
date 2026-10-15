package com.geoblood.repository;

import com.geoblood.entity.DonationRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRecordRepository extends JpaRepository<DonationRecord, Long> {

    List<DonationRecord> findByDonorIdOrderByDonatedAtDesc(Long donorId);

    List<DonationRecord> findByHospitalIdOrderByDonatedAtDesc(Long hospitalId);

    Optional<DonationRecord> findByCertificateId(String certificateId);
}
