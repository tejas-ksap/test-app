package com.pgaccomodation.authservice.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pgaccomodation.authservice.dto.AuthRequest;
import com.pgaccomodation.authservice.dto.AuthResponse;
import com.pgaccomodation.authservice.dto.GoogleAuthRequest;
import com.pgaccomodation.authservice.dto.RegisterRequest;
import com.pgaccomodation.authservice.entity.User;
import com.pgaccomodation.authservice.repository.UserRepository;
import com.pgaccomodation.authservice.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final com.pgaccomodation.authservice.repository.PasswordResetTokenRepository tokenRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final EmailService emailService;

	@Override
	public void register(RegisterRequest request) {
		if (request.getPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
			throw new com.pgaccomodation.authservice.exception.FieldValidationException("confirmPassword", "Passwords do not match");
		}

		if (userRepository.existsByUsername(request.getUsername())) {
			throw new com.pgaccomodation.authservice.exception.FieldValidationException("username", "Username already exists");
		}

		if (userRepository.existsByEmail(request.getEmail())) {
			throw new com.pgaccomodation.authservice.exception.FieldValidationException("email", "Email is already registered");
		}

		if (request.getUsername().equalsIgnoreCase(request.getFullName())) {
			throw new com.pgaccomodation.authservice.exception.FieldValidationException("username", "Username cannot be same as full name");
		}

		User user = User.builder()
				.username(request.getUsername())
				.password(passwordEncoder.encode(request.getPassword()))
				.email(request.getEmail())
				.phoneNumber(request.getPhoneNumber())
				.fullName(request.getFullName())
				.role(request.getRole())
				.isActive(true)
				.build();
		
		userRepository.save(user);
	}

	@Override
	public AuthResponse login(AuthRequest request) {
		User user = userRepository.findByUsernameOrEmail(request.getIdentifier(), request.getIdentifier())
				.orElseThrow(() -> new RuntimeException("Invalid username/email or password"));

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid username/email or password");
		}

		String token = jwtUtil.generateToken(user);
		return new AuthResponse(token, "Login successful");
	}

	@Override
	public AuthResponse googleLogin(GoogleAuthRequest request) {
		// Basic implementation for Google login, matching the new User structure
		User user = userRepository.findByEmail(request.getEmail()).orElseGet(() -> {
			User newUser = User.builder()
					.username(request.getEmail().split("@")[0])
					.password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
					.email(request.getEmail())
					.phoneNumber("N/A")
					.fullName(request.getName() != null ? request.getName() : request.getEmail().split("@")[0])
					.role(com.pgaccomodation.authservice.enums.Role.TENANT)
					.isActive(true)
					.build();
			return userRepository.save(newUser);
		});

		String token = jwtUtil.generateToken(user);
		return new AuthResponse(token, "Google login successful");
	}

	@Override
	@org.springframework.transaction.annotation.Transactional
	public String forgotPassword(com.pgaccomodation.authservice.dto.ForgotPasswordRequest request) {
		User user = userRepository.findByUsernameOrEmail(request.getIdentifier(), request.getIdentifier())
				.orElseThrow(() -> new RuntimeException("User not found with identifier: " + request.getIdentifier()));

		// Delete existing tokens for this user if any
		tokenRepository.findByUser(user).ifPresent(t -> {
			tokenRepository.delete(t);
			tokenRepository.flush();
		});

		String token = java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase(); // Short token for demo
		com.pgaccomodation.authservice.entity.PasswordResetToken resetToken = com.pgaccomodation.authservice.entity.PasswordResetToken.builder()
				.token(token)
				.user(user)
				.expiryDate(java.time.LocalDateTime.now().plusMinutes(15)) // 15 mins expiry
				.build();

		tokenRepository.save(resetToken);

		// Send the token via email
		emailService.sendResetToken(user.getEmail(), token);

		// For development/testing, we still log it.
		System.out.println("DEBUG: Password reset token for " + user.getEmail() + " is: " + token);
		return token;
	}

	@Override
	@org.springframework.transaction.annotation.Transactional
	public void resetPassword(com.pgaccomodation.authservice.dto.ResetPasswordRequest request) {
		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
			throw new com.pgaccomodation.authservice.exception.FieldValidationException("confirmPassword", "Passwords do not match");
		}

		com.pgaccomodation.authservice.entity.PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid or expired token"));

		if (resetToken.isExpired()) {
			tokenRepository.delete(resetToken);
			throw new RuntimeException("Token has expired");
		}

		User user = resetToken.getUser();
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);

		// Delete token after successful reset
		tokenRepository.delete(resetToken);
	}
}
