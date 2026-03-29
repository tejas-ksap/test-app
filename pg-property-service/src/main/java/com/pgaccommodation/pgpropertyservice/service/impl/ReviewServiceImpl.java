package com.pgaccommodation.pgpropertyservice.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pgaccommodation.pgpropertyservice.entity.PgProperty;
import com.pgaccommodation.pgpropertyservice.entity.Review;
import com.pgaccommodation.pgpropertyservice.repository.PgPropertyRepository;
import com.pgaccommodation.pgpropertyservice.repository.ReviewRepository;
import com.pgaccommodation.pgpropertyservice.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PgPropertyRepository pgPropertyRepository;

    @Override
    public Review addReview(Integer pgId, Integer userId, Integer rating, String comment) {
        PgProperty pgProperty = pgPropertyRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (reviewRepository.existsByPgPropertyAndUserId(pgProperty, userId)) {
            throw new RuntimeException("User has already reviewed this property");
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review review = new Review(pgProperty, userId, rating, comment);
        Review savedReview = reviewRepository.save(review);
        
        updatePropertyRating(pgProperty);
        
        return savedReview;
    }

    @Override
    public List<Review> getReviewsForProperty(Integer pgId) {
        PgProperty pgProperty = pgPropertyRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        return reviewRepository.findByPgPropertyOrderByCreatedAtDesc(pgProperty);
    }

    @Override
    public void deleteReview(Integer reviewId, Integer userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this review");
        }

        PgProperty pgProperty = review.getPgProperty();
        reviewRepository.delete(review);
        
        updatePropertyRating(pgProperty);
    }

    @Override
    public Review updateReview(Integer reviewId, Integer userId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this review");
        }

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        review.setRating(rating);
        review.setComment(comment);
        Review savedReview = reviewRepository.save(review);
        
        updatePropertyRating(review.getPgProperty());
        
        return savedReview;
    }
    
    private void updatePropertyRating(PgProperty pgProperty) {
        List<Review> reviews = reviewRepository.findByPgPropertyOrderByCreatedAtDesc(pgProperty);
        if (reviews.isEmpty()) {
            pgProperty.setRating(BigDecimal.ZERO);
        } else {
            double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
            pgProperty.setRating(BigDecimal.valueOf(average).setScale(1, RoundingMode.HALF_UP));
        }
        pgPropertyRepository.save(pgProperty);
    }
}
