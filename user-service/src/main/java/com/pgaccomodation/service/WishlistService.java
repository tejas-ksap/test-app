package com.pgaccomodation.service;

import java.util.List;

import com.pgaccomodation.entity.Wishlist;

public interface WishlistService {
    Wishlist addToWishlist(Integer userId, Integer pgId);
    void removeFromWishlist(Integer userId, Integer pgId);
    List<Wishlist> getUserWishlist(Integer userId);
    boolean isWishlisted(Integer userId, Integer pgId);
}
