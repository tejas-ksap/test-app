package com.pgaccomodation.authservice.dto;

import com.pgaccomodation.authservice.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
	
	@NotBlank(message = "Full name is required")
	@Pattern(regexp = "^[A-Za-z ]+$", message = "Only alphabets are allowed in full name")
	private String fullName;

	@NotBlank(message = "Username is required")
	private String username;

	@NotBlank(message = "Email is required")
	@Email(message = "Enter a valid email address")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;

	@NotBlank(message = "Confirm Password is required")
	private String confirmPassword;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[0-9]*$", message = "Only digits are allowed in phone number")
	@Size(min = 10, max = 10, message = "Phone number must be exactly 10 digits")
	private String phoneNumber;

	@NotNull(message = "Please select a role")
	private Role role;
}
