package com.geoblood.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AvailabilityUpdateResponse {

    private boolean success;

    @JsonProperty("isAvailable")
    private boolean isAvailable;

    private String message;

    public AvailabilityUpdateResponse() {
    }

    public AvailabilityUpdateResponse(boolean success, boolean isAvailable, String message) {
        this.success = success;
        this.isAvailable = isAvailable;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
