package com.geoblood.entity;

import com.geoblood.enums.BloodGroup;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "donation_records", indexes = {
    @Index(name = "idx_donation_donor", columnList = "donor_id"),
    @Index(name = "idx_donation_hospital", columnList = "hospital_id"),
    @Index(name = "idx_donation_certificate", columnList = "certificate_id", unique = true)
})
public class DonationRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private DonorProfile donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private HospitalProfile hospital;

    @Column(name = "hospital_name", length = 255)
    private String hospitalName;

    @Column(name = "blood_request_id")
    private Long bloodRequestId;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", length = 10)
    private BloodGroup bloodGroup;

    @Column(name = "blood_component", length = 50)
    private String bloodComponent;

    @Column(name = "units_donated", nullable = false)
    private Integer unitsDonated = 1;

    @Column(name = "donated_at", nullable = false)
    private Instant donatedAt = Instant.now();

    @Column(name = "certificate_id", unique = true, length = 100)
    private String certificateId;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "authorized_staff", length = 150)
    private String authorizedStaff;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public DonationRecord() {
    }

    public DonationRecord(DonorProfile donor, HospitalProfile hospital, String hospitalName,
                          Long bloodRequestId, BloodGroup bloodGroup, String bloodComponent,
                          Integer unitsDonated, Instant donatedAt, String certificateId,
                          String notes, String authorizedStaff) {
        this.donor = donor;
        this.hospital = hospital;
        this.hospitalName = hospitalName;
        this.bloodRequestId = bloodRequestId;
        this.bloodGroup = bloodGroup;
        this.bloodComponent = bloodComponent;
        this.unitsDonated = unitsDonated;
        this.donatedAt = donatedAt != null ? donatedAt : Instant.now();
        this.certificateId = certificateId;
        this.notes = notes;
        this.authorizedStaff = authorizedStaff;
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (donatedAt == null) donatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DonorProfile getDonor() {
        return donor;
    }

    public void setDonor(DonorProfile donor) {
        this.donor = donor;
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

    public Long getBloodRequestId() {
        return bloodRequestId;
    }

    public void setBloodRequestId(Long bloodRequestId) {
        this.bloodRequestId = bloodRequestId;
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

    public Integer getUnitsDonated() {
        return unitsDonated;
    }

    public void setUnitsDonated(Integer unitsDonated) {
        this.unitsDonated = unitsDonated;
    }

    public Instant getDonatedAt() {
        return donatedAt;
    }

    public void setDonatedAt(Instant donatedAt) {
        this.donatedAt = donatedAt;
    }

    public String getCertificateId() {
        return certificateId;
    }

    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getAuthorizedStaff() {
        return authorizedStaff;
    }

    public void setAuthorizedStaff(String authorizedStaff) {
        this.authorizedStaff = authorizedStaff;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
