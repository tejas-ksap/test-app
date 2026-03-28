package com.pgaccomodation.bookingservice.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.pgaccomodation.bookingservice.dto.BookingResponseDTO;
import com.pgaccomodation.bookingservice.dto.BookingWithUsername;
import com.pgaccomodation.bookingservice.dto.PgPropertyDTO;
import com.pgaccomodation.bookingservice.entity.Booking;
import com.pgaccomodation.bookingservice.entity.PgProperty;
import com.pgaccomodation.bookingservice.exception.ResourceNotFoundException;
import com.pgaccomodation.bookingservice.exception.UnauthorizedAccessException;
import com.pgaccomodation.bookingservice.repository.BookingRepository;
import com.pgaccomodation.bookingservice.repository.PgPropertyRepository;
import com.pgaccomodation.bookingservice.repository.PaymentRepository;
import com.pgaccomodation.bookingservice.entity.Payment;
import com.pgaccomodation.bookingservice.service.BookingService;
import com.pgaccomodation.bookingservice.client.NotificationClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

	private final BookingRepository bookingRepository;
	private final PgPropertyRepository pgPropertyRepository;
	private final PaymentRepository paymentRepository;
	private final NotificationClient notificationClient;

	@Override
	public Booking createBooking(Booking booking) {
		booking.setBookingDate(LocalDateTime.now());
		booking.setStatus("PENDING");
		Booking saved = bookingRepository.save(booking);

		// Notify the PG owner about the new booking request
		pgPropertyRepository.findById(booking.getPgId()).ifPresent(pg -> {
			String msg = String.format(
				"New booking request for '%s' (Booking ID: %d). Please review and confirm.",
				pg.getName(), saved.getId());
			notificationClient.sendNotification(pg.getOwnerId(), msg);

			// Log the payment if it exists
			if (booking.getRazorpayPaymentId() != null) {
				Payment payment = Payment.builder()
						.userId(booking.getUserId())
						.pgId(booking.getPgId())
						.amount(booking.getAmount())
						.paymentDate(LocalDateTime.now())
						.razorpayPaymentId(booking.getRazorpayPaymentId())
						.status("SUCCESS")
						.build();
				paymentRepository.save(payment);
			}
		});

		return saved;
	}

	@Override
	public List<Booking> getAllBookings() {
		return bookingRepository.findAll();
	}

	@Override
	public Optional<Booking> getBookingById(Integer id) {
		return bookingRepository.findById(id);
	}

	@Override
	public List<Booking> getBookingsByUserId(Integer userId) {
		return bookingRepository.findByUserId(userId);
	}

	@Override
	public List<Booking> getBookingsByPgId(Integer pgId) {
		return bookingRepository.findByPgId(pgId);
	}

	@Override
	public void cancelBooking(Integer id) {
		bookingRepository.findById(id).ifPresent(booking -> {
			booking.setStatus("CANCELLED");
			bookingRepository.save(booking);

			// Notify the PG owner that a booking was cancelled
			pgPropertyRepository.findById(booking.getPgId()).ifPresent(pg -> {
				String msg = String.format(
					"Booking ID %d for '%s' has been cancelled by the tenant.",
					id, pg.getName());
				notificationClient.sendNotification(pg.getOwnerId(), msg);
			});
		});
	}

	@Override
	public void updateBookingStatus(Integer bookingId, String status) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking not found with id " + bookingId));

		List<String> allowedStatuses = List.of("PENDING", "CONFIRMED", "CANCELLED");

		if (!allowedStatuses.contains(status.toUpperCase())) {
			throw new IllegalArgumentException("Invalid booking status: " + status);
		}

		booking.setStatus(status.toUpperCase());
		bookingRepository.save(booking);

		// Notify the tenant about the status change
		pgPropertyRepository.findById(booking.getPgId()).ifPresent(pg -> {
			String msg = String.format(
				"Your booking for '%s' (ID: %d) has been updated to: %s.",
				pg.getName(), bookingId, status.toUpperCase());
			notificationClient.sendNotification(booking.getUserId(), msg);
		});
	}

	public List<Booking> getBookingsByPgIdAndOwner(Integer pgId, Integer ownerId) {
		var pgOpt = pgPropertyRepository.findById(pgId);

		if (pgOpt.isEmpty() || !pgOpt.get().getOwnerId().equals(ownerId)) {
			throw new UnauthorizedAccessException("You are not the owner of this PG.");
		}

		return bookingRepository.findByPgId(pgId);
	}

	
	public List<BookingWithUsername> getBookingsWithUserInfoByPgId(Integer pgId, Integer ownerId) {
	    var pg = pgPropertyRepository.findById(pgId)
	            .orElseThrow(() -> new ResourceNotFoundException("PG not found"));

	    if (!pg.getOwnerId().equals(ownerId)) {
	        throw new UnauthorizedAccessException("You are not the owner of this PG.");
	    }

	    return bookingRepository.findBookingsWithUserInfoByPgId(pgId);
	}

	@Override
	public List<BookingResponseDTO> getEnrichedBookingsByUserId(Integer userId) {
	    List<Booking> bookings = bookingRepository.findByUserId(userId);

	    return bookings.stream().map(booking -> {
	        BookingResponseDTO dto = new BookingResponseDTO();
	        dto.setId(booking.getId());
	        dto.setUserId(booking.getUserId());
	        dto.setPgId(booking.getPgId());
	        dto.setBookingDate(booking.getBookingDate());
	        dto.setStartDate(booking.getStartDate());
	        dto.setEndDate(booking.getEndDate());
	        dto.setStatus(booking.getStatus());

	        PgProperty pg = pgPropertyRepository.findById(booking.getPgId())
	                .orElse(null);

	        if (pg != null) {
	            PgPropertyDTO pgDto = new PgPropertyDTO();
	            pgDto.setPgId(pg.getPgId());
	            pgDto.setOwnerId(pg.getOwnerId());
	            pgDto.setName(pg.getName());
	            pgDto.setAddress(pg.getAddress());
	            pgDto.setCity(pg.getCity());
	            pgDto.setState(pg.getState());
	            pgDto.setPincode(pg.getPincode());
	            pgDto.setLandmark(pg.getLandmark());
	            pgDto.setLatitude(pg.getLatitude());
	            pgDto.setLongitude(pg.getLongitude());
	            pgDto.setDescription(pg.getDescription());
	            pgDto.setTotalRooms(pg.getTotalRooms());
	            pgDto.setAvailableRooms(pg.getAvailableRooms());
	            pgDto.setPricePerBed(pg.getPricePerBed());
	            pgDto.setDepositAmount(pg.getDepositAmount());
	            pgDto.setFoodIncluded(pg.getFoodIncluded());
	            pgDto.setAcAvailable(pg.getAcAvailable());
	            pgDto.setWifiAvailable(pg.getWifiAvailable());
	            pgDto.setLaundryAvailable(pg.getLaundryAvailable());
	            pgDto.setPgType(pg.getPgType().name());
	            pgDto.setRating(pg.getRating());
	            pgDto.setVerified(pg.getVerified());
	            pgDto.setImages(pg.getImages());
	            pgDto.setCreatedAt(pg.getCreatedAt());
	            pgDto.setUpdatedAt(pg.getUpdatedAt());

	            dto.setPg(pgDto);
	        }

	        return dto;
	    }).collect(Collectors.toList());
	}

	@Override
	public List<BookingWithUsername> getBookingsWithUsernames(Integer pgId) {
		return bookingRepository.findBookingsWithUserInfoByPgId(pgId);
	}
	
}
