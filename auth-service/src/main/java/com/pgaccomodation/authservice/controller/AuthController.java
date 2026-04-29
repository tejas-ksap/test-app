package com.pgaccomodation.authservice.controller;

import java.util.Map;
import java.util.HashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import jakarta.validation.Valid;

import com.pgaccomodation.authservice.dto.AuthRequest;
import com.pgaccomodation.authservice.dto.AuthResponse;
import com.pgaccomodation.authservice.dto.GoogleAuthRequest;
import com.pgaccomodation.authservice.dto.RegisterRequest;
import com.pgaccomodation.authservice.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request, BindingResult result) {
        // Run custom validation logic
        validateUsername(request.getUsername(), result);
        validatePassword(request.getPassword(), result);

        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                // Return only the first error for each field
                errors.putIfAbsent(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        authService.register(request);
        return ResponseEntity.ok(Map.of("message", "Registration successful"));
    }

    private void validateUsername(String username, BindingResult result) {
        if (username == null || username.isEmpty()) return;
        
        if (username.matches("^[0-9]+$")) {
            result.rejectValue("username", "error.username", "Username cannot be only numeric");
        } else if (!username.matches("^[A-Za-z0-9]+$")) {
            result.rejectValue("username", "error.username", "Username must contain alphabets or alphanumeric characters");
        }
    }

    private void validatePassword(String password, BindingResult result) {
        if (password == null || password.isEmpty()) return;

        if (password.length() < 8) {
            result.rejectValue("password", "error.password", "Password must be at least 8 characters");
        }
        if (!password.matches(".*[A-Z].*")) {
            result.rejectValue("password", "error.password", "Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[@$!%*?&].*")) {
            result.rejectValue("password", "error.password", "Password must contain at least one special character");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody com.pgaccomodation.authservice.dto.ForgotPasswordRequest request) {
        String token = authService.forgotPassword(request);
        // For development/testing: Return the token in the response
        return ResponseEntity.ok(Map.of("message", "Password reset token: " + token + " (Check console for email simulation)"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody com.pgaccomodation.authservice.dto.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}
