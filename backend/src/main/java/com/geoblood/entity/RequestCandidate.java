package com.geoblood.entity;

import com.geoblood.enums.CandidateResponseStatus;
import com.geoblood.enums.EligibilityStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "request_candidates", indexes = {
    @Index(name = "idx_candidate_request", columnList = "request_id"),
    @Index(name = "idx_candidate_donor", columnList = "donor_id"),
    @Index(name = "idx_candidate_status", columnList = "response_status")
}, uniqueConstraints = {
    @UniqueConstraint(name = "uk_candidate_request_donor", columnNames = {"request_id", "donor_id"})
})
public class RequestCandidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest request;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private DonorProfile donor;

    @Column(name = "rank_position")
    private Integer rank;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "approximate_area", length = 255)
    private String approximateArea;

    @Enumerated(EnumType.STRING)
    @Column(name = "eligibility", length = 30)
    private EligibilityStatus eligibility = EligibilityStatus.ELIGIBLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "response_status", length = 20, nullable = false)
    private CandidateResponseStatus responseStatus = CandidateResponseStatus.PENDING;

    @Column(name = "response_time")
    private Instant responseTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public RequestCandidate() {
    }

    public RequestCandidate(BloodRequest request, DonorProfile donor, Integer rank,
                            Double distanceKm, String approximateArea) {
        this.request = request;
        this.donor = donor;
        this.rank = rank;
        this.distanceKm = distanceKm;
        this.approximateArea = approximateArea;
        this.eligibility = EligibilityStatus.ELIGIBLE;
        this.responseStatus = CandidateResponseStatus.PENDING;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BloodRequest getRequest() {
        return request;
    }

    public void setRequest(BloodRequest request) {
        this.request = request;
    }

    public DonorProfile getDonor() {
        return donor;
    }

    public void setDonor(DonorProfile donor) {
        this.donor = donor;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getApproximateArea() {
        return approximateArea;
    }

    public void setApproximateArea(String approximateArea) {
        this.approximateArea = approximateArea;
    }

    public EligibilityStatus getEligibility() {
        return eligibility;
    }

    public void setEligibility(EligibilityStatus eligibility) {
        this.eligibility = eligibility;
    }

    public CandidateResponseStatus getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(CandidateResponseStatus responseStatus) {
        this.responseStatus = responseStatus;
    }

    public Instant getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Instant responseTime) {
        this.responseTime = responseTime;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
