package com.pgaccommodation.pgpropertyservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pgaccommodation.pgpropertyservice.entity.PgProperty;
import com.pgaccommodation.pgpropertyservice.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByPgPropertyOrderByCreatedAtDesc(PgProperty pgProperty);
    Optional<Review> findByPgPropertyAndUserId(PgProperty pgProperty, Integer userId);
    boolean existsByPgPropertyAndUserId(PgProperty pgProperty, Integer userId);
    
    // Custom query to get average rating could be added here
}
