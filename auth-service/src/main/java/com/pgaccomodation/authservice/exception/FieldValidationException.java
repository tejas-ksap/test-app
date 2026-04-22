package com.pgaccomodation.authservice.exception;

import java.util.Map;
import lombok.Getter;

@Getter
public class FieldValidationException extends RuntimeException {
    private final Map<String, String> errors;

    public FieldValidationException(Map<String, String> errors) {
        super("Validation failed");
        this.errors = errors;
    }

    public FieldValidationException(String field, String message) {
        super(message);
        this.errors = Map.of(field, message);
    }
}
