package com.pgaccommodation.pgpropertyservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pgaccommodation.pgpropertyservice.validation.NotOnlyDigits;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "pg_properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PgProperty {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer pgId;

	private Integer ownerId;

	@NotBlank(message = "PG name is required")
	@NotOnlyDigits(message = "PG name cannot be only numbers")
	@Pattern(
			regexp = "^(?=(?:.*[A-Za-z]){10,})(?=.*[A-Za-z])[A-Za-z0-9 ]+$",
			message = "PG name must contain at least 10 alphabets"
	)
	private String name;

	@NotBlank(message = "Address is required")
	@Pattern(regexp = "^(?=.*[A-Za-z])[A-Za-z0-9 ,./#-]+$", message = "Address must contain at least one alphabet")
	@NotOnlyDigits(message = "Address cannot be only numbers")
	@Column(columnDefinition = "TEXT")
	private String address;

	@NotBlank(message = "City is required")
	@Pattern(regexp = "^[A-Za-z ]+$", message = "City must contain only alphabets")
	private String city;

	@NotBlank(message = "State is required")
	@Pattern(regexp = "^[A-Za-z ]+$", message = "State must contain only alphabets")
	private String state;

	@NotBlank(message = "Pincode is required")
	private String pincode;

	@NotBlank(message = "Landmark is required")
	@NotOnlyDigits(message = "Landmark cannot be only numbers")
	@Pattern(
			regexp = "^(?=(?:.*[A-Za-z]){10,})[A-Za-z0-9 ,./#-]+$",
			message = "Landmark must contain at least 10 alphabets"
	)
	private String landmark;

	@NotNull(message = "Latitude is required")
	@DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
	@DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
	private Double latitude;

	@NotNull(message = "Longitude is required")
	@DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
	@DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
	private Double longitude;

	@NotBlank(message = "Description is required")
	@NotOnlyDigits(message = "Description cannot be only numbers")
	@Pattern(
			regexp = "^(?=(?:.*[A-Za-z]){50,}).+$",
			message = "Description must contain at least 50 alphabets"
	)
	@Column(columnDefinition = "TEXT")
	private String description;

	@NotNull(message = "Total rooms is required")
	@Min(value = 0, message = "Total rooms cannot be negative")
	private Integer totalRooms;

	@NotNull(message = "Available rooms is required")
	@Min(value = 0, message = "Available rooms cannot be negative")
	private Integer availableRooms;

	@NotNull(message = "Price per bed is required")
	@Min(value = 0, message = "Price per bed cannot be negative")
	private BigDecimal pricePerBed;

	@NotNull(message = "Deposit amount is required")
	@Min(value = 0, message = "Deposit amount cannot be negative")
	private BigDecimal depositAmount;

	private Boolean foodIncluded;
	private Boolean acAvailable;
	private Boolean wifiAvailable;
	private Boolean laundryAvailable;

	@Enumerated(EnumType.STRING)
	private PgType pgType;

	private BigDecimal rating;
	private Boolean verified;

	@jakarta.persistence.Convert(converter = StringListConverter.class)
	@Column(name = "images", columnDefinition = "TEXT")
	private List<String> images;

	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public enum PgType {
		MALE_ONLY, FEMALE_ONLY, UNISEX
	}
}
