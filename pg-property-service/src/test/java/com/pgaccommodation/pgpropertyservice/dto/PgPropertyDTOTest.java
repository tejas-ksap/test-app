package com.pgaccommodation.pgpropertyservice.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class PgPropertyDTOTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    public void testValidPgName() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("Sai Residency PG") // Valid example
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().noneMatch(v -> v.getPropertyPath().toString().equals("pgName")));
    }

    @Test
    public void testEmptyPgName() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("")
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("PG name is required")));
    }

    @Test
    public void testPgNameWithoutSpace() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("SaiResidencyPG") // No space
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("PG name must contain valid words")));
    }

    @Test
    public void testPgNameWithSpecialCharacters() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("Sai @ Residency")
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("PG name must not contain special characters")));
    }

    @Test
    public void testPgNameWithFewAlphabets() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("Sai PG") // 5 alphabets only
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("PG name must contain at least 10 alphabets")));
    }

    @Test
    public void testPgNameOnlyNumbers() {
        PgPropertyDTO dto = PgPropertyDTO.builder()
                .pgName("1234567890 123")
                .build();
        Set<ConstraintViolation<PgPropertyDTO>> violations = validator.validate(dto);
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("PG name cannot be only numbers")));
    }
}
