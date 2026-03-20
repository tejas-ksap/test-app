package com.pgaccommodation.pgpropertyservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pgaccommodation.pgpropertyservice.entity.Review;
import com.pgaccommodation.pgpropertyservice.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pg-properties/{pgId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> addReview(
            @PathVariable Integer pgId, 
            @RequestParam Integer userId, 
            @RequestParam Integer rating, 
            @RequestParam String comment) {
        Review review = reviewService.addReview(pgId, userId, rating, comment);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Review>> getReviewsForProperty(@PathVariable Integer pgId) {
        List<Review> reviews = reviewService.getReviewsForProperty(pgId);
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(
            @PathVariable Integer pgId, 
            @PathVariable Integer reviewId,
            @RequestParam Integer userId, 
            @RequestParam Integer rating, 
            @RequestParam String comment) {
        Review review = reviewService.updateReview(reviewId, userId, rating, comment);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Integer pgId, 
            @PathVariable Integer reviewId,
            @RequestParam Integer userId) {
        reviewService.deleteReview(reviewId, userId);
        return ResponseEntity.noContent().build();
    }
}
