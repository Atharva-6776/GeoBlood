package com.geoblood.entity;

import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.EligibilityStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "donor_profiles", indexes = {
    @Index(name = "idx_donor_blood_group", columnList = "blood_group"),
    @Index(name = "idx_donor_is_available", columnList = "is_available"),
    @Index(name = "idx_donor_user_id", columnList = "user_id", unique = true)
})
public class DonorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_group", length = 10)
    private BloodGroup bloodGroup;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "location_area", length = 255)
    private String locationArea;

    @Column(name = "contact_number", length = 30)
    private String contactNumber;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "eligibility_status", length = 30, nullable = false)
    private EligibilityStatus eligibilityStatus = EligibilityStatus.PROFILE_INCOMPLETE;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "total_donations", nullable = false)
    private int totalDonations = 0;

    @Column(name = "email_alerts", nullable = false)
    private boolean emailAlerts = true;

    @Column(name = "sms_alerts", nullable = false)
    private boolean smsAlerts = true;

    @Column(name = "emergency_push", nullable = false)
    private boolean emergencyPush = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public DonorProfile() {
    }

    public DonorProfile(User user) {
        this.user = user;
        this.isAvailable = true;
        this.eligibilityStatus = EligibilityStatus.PROFILE_INCOMPLETE;
        this.totalDonations = 0;
        this.emailAlerts = true;
        this.smsAlerts = true;
        this.emergencyPush = true;
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
        if (updatedAt == null) updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getLocationArea() {
        return locationArea;
    }

    public void setLocationArea(String locationArea) {
        this.locationArea = locationArea;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public EligibilityStatus getEligibilityStatus() {
        return eligibilityStatus;
    }

    public void setEligibilityStatus(EligibilityStatus eligibilityStatus) {
        this.eligibilityStatus = eligibilityStatus;
    }

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public int getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(int totalDonations) {
        this.totalDonations = totalDonations;
    }

    public boolean isEmailAlerts() {
        return emailAlerts;
    }

    public void setEmailAlerts(boolean emailAlerts) {
        this.emailAlerts = emailAlerts;
    }

    public boolean isSmsAlerts() {
        return smsAlerts;
    }

    public void setSmsAlerts(boolean smsAlerts) {
        this.smsAlerts = smsAlerts;
    }

    public boolean isEmergencyPush() {
        return emergencyPush;
    }

    public void setEmergencyPush(boolean emergencyPush) {
        this.emergencyPush = emergencyPush;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
