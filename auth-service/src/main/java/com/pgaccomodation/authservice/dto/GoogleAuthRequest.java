package com.pgaccomodation.authservice.dto;

import lombok.Data;

@Data
public class GoogleAuthRequest {
	private String accessToken;
	private String email;
	private String name;
	private String picture;
}
