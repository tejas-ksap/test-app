package com.pgaccommodation.pgpropertyservice.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NotOnlyDigitsValidator implements ConstraintValidator<NotOnlyDigits, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }
        // Returns false if the string contains ONLY digits and whitespace
        return !value.matches("^[0-9\\s]+$");
    }
}
