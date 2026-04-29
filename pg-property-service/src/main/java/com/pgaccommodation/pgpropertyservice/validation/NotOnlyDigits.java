package com.pgaccommodation.pgpropertyservice.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NotOnlyDigitsValidator.class)
public @interface NotOnlyDigits {
    String message() default "Cannot be only numbers";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
