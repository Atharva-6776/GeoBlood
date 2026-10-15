package com.geoblood.dto;

import com.geoblood.enums.BloodGroup;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class DonorProfileRequest {

    private String name;

    @NotNull(message = "Blood group is required")
    private BloodGroup bloodGroup;

    @NotBlank(message = "City or neighborhood area is required")
    private String locationArea;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^\\+?[\\d\\s-]{8,16}$", message = "Please provide a valid phone number (8-16 digits)")
    private String contactNumber;

    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    private NotificationPrefsDto notificationPrefs;

    public DonorProfileRequest() {
    }

    public DonorProfileRequest(String name, BloodGroup bloodGroup, String locationArea,
                               String contactNumber, Double latitude, Double longitude,
                               NotificationPrefsDto notificationPrefs) {
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.locationArea = locationArea;
        this.contactNumber = contactNumber;
        this.latitude = latitude;
        this.longitude = longitude;
        this.notificationPrefs = notificationPrefs;
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

    public NotificationPrefsDto getNotificationPrefs() {
        return notificationPrefs;
    }

    public void setNotificationPrefs(NotificationPrefsDto notificationPrefs) {
        this.notificationPrefs = notificationPrefs;
    }
}
