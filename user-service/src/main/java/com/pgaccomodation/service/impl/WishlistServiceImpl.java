package com.pgaccomodation.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pgaccomodation.entity.User;
import com.pgaccomodation.entity.Wishlist;
import com.pgaccomodation.repository.UserRepository;
import com.pgaccomodation.repository.WishlistRepository;
import com.pgaccomodation.service.WishlistService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    @Override
    public Wishlist addToWishlist(Integer userId, Integer pgId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (wishlistRepository.existsByUserAndPgId(user, pgId)) {
            throw new RuntimeException("Property is already in wishlist");
        }

        Wishlist wishlist = new Wishlist(user, pgId);
        return wishlistRepository.save(wishlist);
    }

    @Override
    public void removeFromWishlist(Integer userId, Integer pgId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Wishlist wishlist = wishlistRepository.findByUserAndPgId(user, pgId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        wishlistRepository.delete(wishlist);
    }

    @Override
    public List<Wishlist> getUserWishlist(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return wishlistRepository.findByUser(user);
    }

    @Override
    public boolean isWishlisted(Integer userId, Integer pgId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return wishlistRepository.existsByUserAndPgId(user, pgId);
    }
}
