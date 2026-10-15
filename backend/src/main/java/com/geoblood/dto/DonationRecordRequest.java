package com.geoblood.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DonationRecordRequest {

    @NotNull(message = "Blood request ID is required")
    private Long requestId;

    @NotNull(message = "Donor ID / candidate reference is required")
    private Long donorId;

    @NotNull(message = "Units donated must be a positive integer")
    @Min(value = 1, message = "Units donated must be at least 1")
    private Integer unitsDonated;

    private String donatedAt;
    private String notes;

    public DonationRecordRequest() {
    }

    public DonationRecordRequest(Long requestId, Long donorId, Integer unitsDonated, String donatedAt, String notes) {
        this.requestId = requestId;
        this.donorId = donorId;
        this.unitsDonated = unitsDonated;
        this.donatedAt = donatedAt;
        this.notes = notes;
    }

    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
