package com.geoblood.dto;

public class DonorInvitationResponse {

    private String id;
    private String requestId;
    private String hospitalName;
    private String hospitalAddress;
    private String bloodGroup;
    private String bloodComponent;
    private Integer unitsNeeded;
    private String urgency;
    private Double distanceKm;
    private String status;
    private String createdAt;
    private String expiresAt;
    private String patientRef;

    public DonorInvitationResponse() {
    }

    public DonorInvitationResponse(String id, String requestId, String hospitalName,
                                   String hospitalAddress, String bloodGroup, String bloodComponent,
                                   Integer unitsNeeded, String urgency, Double distanceKm,
                                   String status, String createdAt, String expiresAt, String patientRef) {
        this.id = id;
        this.requestId = requestId;
        this.hospitalName = hospitalName;
        this.hospitalAddress = hospitalAddress;
        this.bloodGroup = bloodGroup;
        this.bloodComponent = bloodComponent;
        this.unitsNeeded = unitsNeeded;
        this.urgency = urgency;
        this.distanceKm = distanceKm;
        this.status = status;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.patientRef = patientRef;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(String hospitalAddress) {
        this.hospitalAddress = hospitalAddress;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
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

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(String expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getPatientRef() {
        return patientRef;
    }

    public void setPatientRef(String patientRef) {
        this.patientRef = patientRef;
    }
}
