package com.pgaccomodation.bookingservice.repository;

import com.pgaccomodation.bookingservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByUserIdOrderByPaymentDateDesc(Integer userId);
}
