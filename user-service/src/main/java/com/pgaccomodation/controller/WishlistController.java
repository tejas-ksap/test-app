package com.pgaccomodation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pgaccomodation.entity.Wishlist;
import com.pgaccomodation.service.WishlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{pgId}")
    public ResponseEntity<Wishlist> addToWishlist(@PathVariable Integer userId, @PathVariable Integer pgId) {
        Wishlist wishlist = wishlistService.addToWishlist(userId, pgId);
        return new ResponseEntity<>(wishlist, HttpStatus.CREATED);
    }

    @DeleteMapping("/{pgId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Integer userId, @PathVariable Integer pgId) {
        wishlistService.removeFromWishlist(userId, pgId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Integer userId) {
        List<Wishlist> wishlist = wishlistService.getUserWishlist(userId);
        return ResponseEntity.ok(wishlist);
    }

    @GetMapping("/{pgId}/check")
    public ResponseEntity<Boolean> checkWishlistStatus(@PathVariable Integer userId, @PathVariable Integer pgId) {
        boolean isWishlisted = wishlistService.isWishlisted(userId, pgId);
        return ResponseEntity.ok(isWishlisted);
    }
}
