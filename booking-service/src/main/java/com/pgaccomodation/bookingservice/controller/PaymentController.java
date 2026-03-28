package com.pgaccomodation.bookingservice.controller;

import com.pgaccomodation.bookingservice.entity.Payment;
import com.pgaccomodation.bookingservice.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;

    @PreAuthorize("hasAnyRole('TENANT', 'ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payment>> getByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(paymentRepository.findByUserIdOrderByPaymentDateDesc(userId));
    }
}
