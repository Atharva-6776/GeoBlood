package com.geoblood.enums;

public enum Role {
    DONOR,
    HOSPITAL,
    ADMIN;

    public static Role fromString(String value) {
        if (value == null) return null;
        return Role.valueOf(value.trim().toUpperCase());
    }
}
