package com.pgaccomodation.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pgaccomodation.entity.User;
import com.pgaccomodation.entity.Wishlist;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    List<Wishlist> findByUser(User user);
    Optional<Wishlist> findByUserAndPgId(User user, Integer pgId);
    boolean existsByUserAndPgId(User user, Integer pgId);
}
