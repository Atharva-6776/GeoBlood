package com.geoblood.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;

public class HospitalProfileRequest {

    @NotBlank(message = "Facility name is required")
    private String facilityName;

    private String licenseNumber;

    @NotBlank(message = "Hospital address is required")
    private String address;

    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @NotBlank(message = "Contact phone is required")
    private String contactPhone;

    private String emergencyHotline;

    public HospitalProfileRequest() {
    }

    public HospitalProfileRequest(String facilityName, String licenseNumber, String address,
                                  Double latitude, Double longitude, String contactPhone,
                                  String emergencyHotline) {
        this.facilityName = facilityName;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.contactPhone = contactPhone;
        this.emergencyHotline = emergencyHotline;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getEmergencyHotline() {
        return emergencyHotline;
    }

    public void setEmergencyHotline(String emergencyHotline) {
        this.emergencyHotline = emergencyHotline;
    }
}
