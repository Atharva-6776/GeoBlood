package com.geoblood.exception;

import java.util.Collections;
import java.util.Map;

public class BadRequestException extends RuntimeException {

    private final Map<String, String> errors;

    public BadRequestException(String message) {
        super(message);
        this.errors = Collections.emptyMap();
    }

    public BadRequestException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
