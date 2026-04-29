package com.pgaccomodation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class EditProfileRequest {

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "Only alphabets are allowed in full name")
    private String displayName;
}
