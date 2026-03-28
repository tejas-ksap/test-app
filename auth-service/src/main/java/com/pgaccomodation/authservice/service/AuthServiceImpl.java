package com.pgaccomodation.authservice.service;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.pgaccomodation.authservice.dto.AuthRequest;
import com.pgaccomodation.authservice.dto.AuthResponse;
import com.pgaccomodation.authservice.dto.GoogleAuthRequest;
import com.pgaccomodation.authservice.dto.RegisterRequest;
import com.pgaccomodation.authservice.entity.User;
import com.pgaccomodation.authservice.enums.UserType;
import com.pgaccomodation.authservice.repository.UserRepository;
import com.pgaccomodation.authservice.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;

	@Override
	public void register(RegisterRequest request) {
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setEmail(request.getEmail());
		user.setPhone(request.getPhone());
		user.setFullName(request.getFullName());
		user.setUserType(request.getUserType());
		userRepository.save(user);
	}

	@Override
	public AuthResponse login(AuthRequest request) {
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

		User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
		String token = jwtUtil.generateToken(user);
		return new AuthResponse(token);
	}

	@Override
	public AuthResponse googleLogin(GoogleAuthRequest request) {
		try {
			// Verify the access token with Google's tokeninfo endpoint
			RestTemplate restTemplate = new RestTemplate();
			String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?access_token=" + request.getAccessToken();
			
			try {
				restTemplate.getForObject(tokenInfoUrl, String.class);
			} catch (Exception e) {
				throw new RuntimeException("Invalid Google access token");
			}

			String email = request.getEmail();
			String name = request.getName();
			String pictureUrl = request.getPicture();

			if (email == null || email.isEmpty()) {
				throw new RuntimeException("Email is required for Google sign-in");
			}

			// Find existing user or create a new one
			User user = userRepository.findByEmail(email).orElseGet(() -> {
				User newUser = new User();
				// Generate a unique username from email prefix
				String usernameBase = email.split("@")[0];
				String username = usernameBase;
				int counter = 1;
				while (userRepository.existsByUsername(username)) {
					username = usernameBase + counter++;
				}
				newUser.setUsername(username);
				newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
				newUser.setEmail(email);
				newUser.setPhone("N/A");
				newUser.setFullName(name != null ? name : usernameBase);
				newUser.setUserType(UserType.TENANT); // Default role for Google sign-in
				newUser.setProfilePic(pictureUrl);
				newUser.setActive(true);
				return userRepository.save(newUser);
			});

			String token = jwtUtil.generateToken(user);
			return new AuthResponse(token);

		} catch (Exception e) {
			throw new RuntimeException("Google authentication failed: " + e.getMessage(), e);
		}
	}
}
