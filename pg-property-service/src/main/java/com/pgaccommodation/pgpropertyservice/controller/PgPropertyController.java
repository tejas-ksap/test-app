package com.pgaccommodation.pgpropertyservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.BindingResult;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.validation.FieldError;

import com.pgaccommodation.pgpropertyservice.dto.PgPropertyDTO;
import com.pgaccommodation.pgpropertyservice.entity.PgProperty;
import com.pgaccommodation.pgpropertyservice.service.PgPropertyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pg-properties")
@RequiredArgsConstructor
public class PgPropertyController {

	private final PgPropertyService pgPropertyService;

	// Only OWNERs can add PG properties
	@PreAuthorize("hasRole('OWNER')")
	@PostMapping
	public ResponseEntity<?> addPgProperty(@Valid @RequestBody PgPropertyDTO pgPropertyDTO, BindingResult bindingResult) {
		Map<String, String> errors = new HashMap<>();
		
		if (bindingResult.hasErrors()) {
			for (FieldError error : bindingResult.getFieldErrors()) {
				errors.put(error.getField(), error.getDefaultMessage());
			}
		}

		// Custom vacancy check
		if (pgPropertyDTO.getAvailableRooms() != null && pgPropertyDTO.getTotalRooms() != null) {
			if (pgPropertyDTO.getAvailableRooms() > pgPropertyDTO.getTotalRooms()) {
				errors.put("availableRooms", "Vacancy cannot exceed total capacity");
			}
		}

		if (!errors.isEmpty()) {
			return ResponseEntity.badRequest().body(errors);
		}

		PgProperty pgProperty = mapToEntity(pgPropertyDTO);
		return ResponseEntity.ok(pgPropertyService.addPgProperty(pgProperty));
	}

	// Allow everyone (including unauthenticated users) to view all PG properties
	@GetMapping
	public ResponseEntity<List<PgProperty>> getAllPgProperties() {
		return ResponseEntity.ok(pgPropertyService.getAllPgProperties());
	}

	// Anyone can search PGs by city
	@GetMapping("/city/{city}")
	public ResponseEntity<List<PgProperty>> getPgByCity(@PathVariable("city") String city) {
		return ResponseEntity.ok(pgPropertiesByCity(city));
	}

	private List<PgProperty> pgPropertiesByCity(String city) {
		return pgPropertyService.getPgPropertiesByCity(city);
	}

	// Anyone can view a single PG
	@GetMapping("/{id}")
	public ResponseEntity<PgProperty> getPgById(@PathVariable("id") Integer id) {
		return pgPropertyService.getPgPropertyById(id).map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	// Only OWNERs or ADMINs can delete PG
	@PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePg(@PathVariable("id") Integer id) {
		pgPropertyService.deletePgProperty(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/owner/{ownerId}")
	public ResponseEntity<List<PgProperty>> getPgsByOwnerId(@PathVariable Integer ownerId) {
		List<PgProperty> pgs = pgPropertyService.getPgPropertiesByOwnerId(ownerId);
		return ResponseEntity.ok(pgs);
	}

	// Only OWNERs or ADMINs can update PG
	@PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
	@PutMapping("/{id}")
	public ResponseEntity<?> updatePgProperty(@PathVariable Integer id,
			@Valid @RequestBody PgPropertyDTO pgPropertyDTO, BindingResult bindingResult) {
		Map<String, String> errors = new HashMap<>();

		if (bindingResult.hasErrors()) {
			for (FieldError error : bindingResult.getFieldErrors()) {
				errors.put(error.getField(), error.getDefaultMessage());
			}
		}

		// Custom vacancy check
		if (pgPropertyDTO.getAvailableRooms() != null && pgPropertyDTO.getTotalRooms() != null) {
			if (pgPropertyDTO.getAvailableRooms() > pgPropertyDTO.getTotalRooms()) {
				errors.put("availableRooms", "Vacancy cannot exceed total capacity");
			}
		}

		if (!errors.isEmpty()) {
			return ResponseEntity.badRequest().body(errors);
		}

		PgProperty pgProperty = mapToEntity(pgPropertyDTO);
		return ResponseEntity.ok(pgPropertyService.updatePgProperty(id, pgProperty));
	}

	private PgProperty mapToEntity(PgPropertyDTO dto) {
		return PgProperty.builder()
				.name(dto.getPgName())
				.address(dto.getAddress())
				.city(dto.getCity())
				.state(dto.getState())
				.pincode(dto.getPincode())
				.landmark(dto.getLandmark())
				.latitude(dto.getLatitude())
				.longitude(dto.getLongitude())
				.description(dto.getDescription())
				.totalRooms(dto.getTotalRooms())
				.availableRooms(dto.getAvailableRooms())
				.pricePerBed(dto.getPricePerBed())
				.depositAmount(dto.getDepositAmount())
				.foodIncluded(dto.getFoodIncluded())
				.acAvailable(dto.getAcAvailable())
				.wifiAvailable(dto.getWifiAvailable())
				.laundryAvailable(dto.getLaundryAvailable())
				.rating(dto.getRating())
				.verified(dto.getVerified())
				.ownerId(dto.getOwnerId())
				.images(dto.getImages())
				.pgType(dto.getPgType() != null ? PgProperty.PgType.valueOf(dto.getPgType()) : null)
				.build();
	}

}
