package com.geoblood.entity;

import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.RequestStatus;
import com.geoblood.enums.Urgency;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "blood_requests", indexes = {
    @Index(name = "idx_request_status", columnList = "status"),
    @Index(name = "idx_request_blood_group", columnList = "blood_group"),
    @Index(name = "idx_request_hospital", columnList = "hospital_id")
})
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private HospitalProfile hospital;

    @Column(name = "hospital_name", length = 255)
    private String hospitalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", nullable = false, length = 10)
    private BloodGroup bloodGroup;

    @Column(name = "blood_component", nullable = false, length = 50)
    private String bloodComponent;

    @Column(name = "units_needed", nullable = false)
    private Integer unitsNeeded = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency", nullable = false, length = 20)
    private Urgency urgency = Urgency.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status = RequestStatus.OPEN;

    @Column(name = "hospital_location", length = 500)
    private String hospitalLocation;

    @Column(name = "patient_ref", length = 255)
    private String patientRef;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "accepted_count", nullable = false)
    private int acceptedCount = 0;

    @Column(name = "matched_candidates_count", nullable = false)
    private int matchedCandidatesCount = 0;

    public BloodRequest() {
    }

    public BloodRequest(HospitalProfile hospital, String hospitalName, BloodGroup bloodGroup,
                        String bloodComponent, Integer unitsNeeded, Urgency urgency,
                        String hospitalLocation, String patientRef, String notes) {
        this.hospital = hospital;
        this.hospitalName = hospitalName;
        this.bloodGroup = bloodGroup;
        this.bloodComponent = bloodComponent;
        this.unitsNeeded = unitsNeeded;
        this.urgency = urgency;
        this.status = RequestStatus.OPEN;
        this.hospitalLocation = hospitalLocation;
        this.patientRef = patientRef;
        this.notes = notes;
        this.createdAt = Instant.now();
        this.expiresAt = Instant.now().plus(4, ChronoUnit.HOURS);
        this.acceptedCount = 0;
        this.matchedCandidatesCount = 0;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (expiresAt == null) expiresAt = createdAt.plus(4, ChronoUnit.HOURS);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HospitalProfile getHospital() {
        return hospital;
    }

    public void setHospital(HospitalProfile hospital) {
        this.hospital = hospital;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getBloodComponent() {
        return bloodComponent;
    }

    public void setBloodComponent(String bloodComponent) {
        this.bloodComponent = bloodComponent;
    }

    public Integer getUnitsNeeded() {
        return unitsNeeded;
    }

    public void setUnitsNeeded(Integer unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public Urgency getUrgency() {
        return urgency;
    }

    public void setUrgency(Urgency urgency) {
        this.urgency = urgency;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public String getHospitalLocation() {
        return hospitalLocation;
    }

    public void setHospitalLocation(String hospitalLocation) {
        this.hospitalLocation = hospitalLocation;
    }

    public String getPatientRef() {
        return patientRef;
    }

    public void setPatientRef(String patientRef) {
        this.patientRef = patientRef;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getAcceptedCount() {
        return acceptedCount;
    }

    public void setAcceptedCount(int acceptedCount) {
        this.acceptedCount = acceptedCount;
    }

    public int getMatchedCandidatesCount() {
        return matchedCandidatesCount;
    }

    public void setMatchedCandidatesCount(int matchedCandidatesCount) {
        this.matchedCandidatesCount = matchedCandidatesCount;
    }
}
