package com.pgaccommodation.pgpropertyservice.dto;

import com.pgaccommodation.pgpropertyservice.validation.NotOnlyDigits;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PgPropertyDTO {

    @NotBlank(message = "PG name is required")
    @Pattern(regexp = "^(?=(?:.*[A-Za-z]){10,}).*$", message = "PG name must contain at least 10 alphabets")
    @Pattern(regexp = "^[A-Za-z0-9 ]+$", message = "PG name must not contain special characters")
    @NotOnlyDigits(message = "PG name cannot be only numbers")
    private String pgName;

    @NotBlank(message = "PG type is required")
    private String pgType;

    @NotBlank(message = "Description is required")
    @Pattern(regexp = "^(?=(?:.*[A-Za-z]){50,}).*$", message = "Description must contain at least 50 alphabets")
    @NotOnlyDigits(message = "Description cannot be only numbers")
    private String description;

    @NotNull(message = "Rating must be between 0 and 5")
    @DecimalMin(value = "0.0", message = "Rating must be between 0 and 5")
    @DecimalMax(value = "5.0", message = "Rating must be between 0 and 5")
    private BigDecimal rating;

    @NotBlank(message = "Address is required")
    @Pattern(regexp = "^(?=.*[A-Za-z]).*$", message = "Address must contain at least one alphabet")
    @NotOnlyDigits(message = "Address cannot be only numbers")
    private String address;

    @NotBlank(message = "City is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "City must contain only alphabets")
    private String city;

    @NotBlank(message = "State is required")
    @Pattern(regexp = "^[A-Za-z ]+$", message = "State must contain only alphabets")
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^\\d{6}$", message = "Pincode must be exactly 6 digits")
    private String pincode;

    @NotBlank(message = "Landmark is required")
    @Pattern(regexp = "^(?=(?:.*[A-Za-z]){10,}).*$", message = "Landmark must contain at least 10 alphabets")
    @NotOnlyDigits(message = "Landmark cannot be only numbers")
    private String landmark;

    @NotNull(message = "Latitude must be between -90 and 90")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    private Double latitude;

    @NotNull(message = "Longitude must be between -180 and 180")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    private Double longitude;

    @NotNull(message = "Total capacity must be greater than 0")
    @Min(value = 1, message = "Total capacity must be greater than 0")
    private Integer totalRooms;

    @NotNull(message = "Vacancy cannot be negative")
    @Min(value = 0, message = "Vacancy cannot be negative")
    private Integer availableRooms;

    @NotNull(message = "Price must be greater than 0")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal pricePerBed;

    @NotNull(message = "Security deposit cannot be negative")
    @DecimalMin(value = "0.0", message = "Security deposit cannot be negative")
    private BigDecimal depositAmount;

    // These fields don't have specific validation requested but are needed for the entity
    private Boolean foodIncluded;
    private Boolean acAvailable;
    private Boolean wifiAvailable;
    private Boolean laundryAvailable;
    private Boolean verified;
    private Integer ownerId;
    private List<String> images;
}
