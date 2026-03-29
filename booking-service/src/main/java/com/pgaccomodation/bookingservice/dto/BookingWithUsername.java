package com.pgaccomodation.bookingservice.dto;

public interface BookingWithUsername {
    Integer getId();
    Integer getUserId();
    String getUsername(); // from users table
    String getFullName();
    String getEmail();
    String getPhone();
    String getProfileImage(); // to match u.profile_image AS profileImage
    Integer getPgId();
    String getStatus();
    java.time.LocalDateTime getStartDate();
    java.time.LocalDateTime getEndDate();
    java.time.LocalDateTime getBookingDate();
}