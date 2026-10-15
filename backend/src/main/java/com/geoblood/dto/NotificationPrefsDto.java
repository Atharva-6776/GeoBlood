package com.geoblood.dto;

public class NotificationPrefsDto {

    private boolean emailAlerts = true;
    private boolean smsAlerts = true;
    private boolean emergencyPush = true;

    public NotificationPrefsDto() {
    }

    public NotificationPrefsDto(boolean emailAlerts, boolean smsAlerts, boolean emergencyPush) {
        this.emailAlerts = emailAlerts;
        this.smsAlerts = smsAlerts;
        this.emergencyPush = emergencyPush;
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
}
