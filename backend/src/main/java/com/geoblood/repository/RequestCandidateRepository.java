package com.geoblood.repository;

import com.geoblood.entity.RequestCandidate;
import com.geoblood.enums.CandidateResponseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RequestCandidateRepository extends JpaRepository<RequestCandidate, Long> {

    List<RequestCandidate> findByRequestIdOrderByRankAsc(Long requestId);

    List<RequestCandidate> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    Optional<RequestCandidate> findByRequestIdAndDonorId(Long requestId, Long donorId);

    long countByRequestIdAndResponseStatus(Long requestId, CandidateResponseStatus responseStatus);
}
