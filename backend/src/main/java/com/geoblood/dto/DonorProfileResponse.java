package com.geoblood.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.geoblood.enums.BloodGroup;
import com.geoblood.enums.EligibilityStatus;

import java.time.LocalDate;

public class DonorProfileResponse {

    private String id;
    private String userId;
    private String name;
    private BloodGroup bloodGroup;

    @JsonProperty("isAvailable")
    private boolean isAvailable;

    private String locationArea;
    private String contactNumber;
    private Double latitude;
    private Double longitude;
    private LocalDate lastDonationDate;
    private EligibilityStatus eligibilityStatus;
    private int totalDonations;
    private NotificationPrefsDto notificationPrefs;

    public DonorProfileResponse() {
    }

    public DonorProfileResponse(String id, String userId, String name, BloodGroup bloodGroup,
                                boolean isAvailable, String locationArea, String contactNumber,
                                Double latitude, Double longitude, LocalDate lastDonationDate,
                                EligibilityStatus eligibilityStatus, int totalDonations,
                                NotificationPrefsDto notificationPrefs) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.isAvailable = isAvailable;
        this.locationArea = locationArea;
        this.contactNumber = contactNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.lastDonationDate = lastDonationDate;
        this.eligibilityStatus = eligibilityStatus;
        this.totalDonations = totalDonations;
        this.notificationPrefs = notificationPrefs;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BloodGroup getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(BloodGroup bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
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

    public LocalDate getLastDonationDate() {
        return lastDonationDate;
    }

    public void setLastDonationDate(LocalDate lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }

    public EligibilityStatus getEligibilityStatus() {
        return eligibilityStatus;
    }

    public void setEligibilityStatus(EligibilityStatus eligibilityStatus) {
        this.eligibilityStatus = eligibilityStatus;
    }

    public int getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(int totalDonations) {
        this.totalDonations = totalDonations;
    }

    public NotificationPrefsDto getNotificationPrefs() {
        return notificationPrefs;
    }

    public void setNotificationPrefs(NotificationPrefsDto notificationPrefs) {
        this.notificationPrefs = notificationPrefs;
    }
}
