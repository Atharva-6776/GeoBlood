package com.geoblood.exception;

import java.util.Collections;
import java.util.Map;

public class UnauthorizedException extends RuntimeException {

    private final Map<String, String> errors;

    public UnauthorizedException(String message) {
        super(message);
        this.errors = Collections.emptyMap();
    }

    public UnauthorizedException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
