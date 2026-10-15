package com.geoblood.dto;

import com.geoblood.enums.VerificationStatus;

public class HospitalProfileResponse {

    private String id;
    private String userId;
    private String facilityName;
    private String licenseNumber;
    private String address;
    private Double latitude;
    private Double longitude;
    private String contactPhone;
    private String emergencyHotline;
    private VerificationStatus verificationStatus;

    public HospitalProfileResponse() {
    }

    public HospitalProfileResponse(String id, String userId, String facilityName,
                                   String licenseNumber, String address, Double latitude,
                                   Double longitude, String contactPhone, String emergencyHotline,
                                   VerificationStatus verificationStatus) {
        this.id = id;
        this.userId = userId;
        this.facilityName = facilityName;
        this.licenseNumber = licenseNumber;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.contactPhone = contactPhone;
        this.emergencyHotline = emergencyHotline;
        this.verificationStatus = verificationStatus;
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

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }
}
