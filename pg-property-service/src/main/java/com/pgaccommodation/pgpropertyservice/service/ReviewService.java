package com.pgaccommodation.pgpropertyservice.service;

import java.util.List;

import com.pgaccommodation.pgpropertyservice.entity.Review;

public interface ReviewService {
    Review addReview(Integer pgId, Integer userId, Integer rating, String comment);
    List<Review> getReviewsForProperty(Integer pgId);
    void deleteReview(Integer reviewId, Integer userId);
    Review updateReview(Integer reviewId, Integer userId, Integer rating, String comment);
}
