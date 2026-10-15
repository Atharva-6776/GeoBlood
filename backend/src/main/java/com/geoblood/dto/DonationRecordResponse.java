package com.geoblood.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DonationRecordResponse {

    private String id;
    private String requestId;
    private String donorId;
    private String hospitalName;
    private String bloodGroup;
    private String bloodComponent;
    private Integer unitsDonated;
    private String donatedAt;
    private String certificateId;
    private String notes;

    public DonationRecordResponse() {
    }

    public DonationRecordResponse(String id, String hospitalName, String bloodGroup,
                                  String bloodComponent, Integer unitsDonated, String donatedAt,
                                  String certificateId, String notes) {
        this.id = id;
        this.hospitalName = hospitalName;
        this.bloodGroup = bloodGroup;
        this.bloodComponent = bloodComponent;
        this.unitsDonated = unitsDonated;
        this.donatedAt = donatedAt;
        this.certificateId = certificateId;
        this.notes = notes;
    }

    public DonationRecordResponse(String id, String requestId, String donorId, String hospitalName,
                                  String bloodGroup, String bloodComponent, Integer unitsDonated,
                                  String donatedAt, String certificateId, String notes) {
        this.id = id;
        this.requestId = requestId;
        this.donorId = donorId;
        this.hospitalName = hospitalName;
        this.bloodGroup = bloodGroup;
        this.bloodComponent = bloodComponent;
        this.unitsDonated = unitsDonated;
        this.donatedAt = donatedAt;
        this.certificateId = certificateId;
        this.notes = notes;
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

    public String getDonorId() {
        return donorId;
    }

    public void setDonorId(String donorId) {
        this.donorId = donorId;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
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

    public Integer getUnitsDonated() {
        return unitsDonated;
    }

    public void setUnitsDonated(Integer unitsDonated) {
        this.unitsDonated = unitsDonated;
    }

    public String getDonatedAt() {
        return donatedAt;
    }

    public void setDonatedAt(String donatedAt) {
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
}
