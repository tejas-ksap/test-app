package com.pgaccomodation.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgaccomodation.entity.User;
import com.pgaccomodation.service.UserService;
import com.pgaccomodation.util.JwtUtil;
import com.pgaccomodation.dto.EditProfileRequest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Register a new user - open to all
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registered = userService.registerUser(user);
        return ResponseEntity.ok(registered);
    }

    // Anyone authenticated can get user by ID (needed for owner contacts)
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Only ADMIN can get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Accessible by ADMIN or the user themselves (basic case: keep it ADMIN for now)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // OWNER or ADMIN can update users
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Only ADMIN can delete users
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Any authenticated user can get their own data
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(HttpServletRequest request, @Valid @RequestBody EditProfileRequest profileRequest, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : result.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(errors);
        }

        String token = request.getHeader("Authorization").replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);
        return userService.getUserByUsername(username)
                .map(currentUser -> {
                    currentUser.setFullName(profileRequest.getDisplayName());
                    User user = userService.updateUser(currentUser.getUserid(), currentUser);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Example: Only OWNERs can access this
    @PreAuthorize("hasRole('OWNER')")
    @GetMapping("/owner/only")
    public ResponseEntity<String> ownerOnlyAccess() {
        return ResponseEntity.ok("This data is only for OWNERS.");
    }

    // Example: Only TENANTs can access this
    @PreAuthorize("hasRole('TENANT')")
    @GetMapping("/tenant/only")
    public ResponseEntity<String> tenantOnlyAccess() {
        return ResponseEntity.ok("This data is only for TENANTS.");
    }
}

