package com.cakeshop.repository;

import com.cakeshop.model.CartItem;
import com.cakeshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndCakeId(User user, Long cakeId);
    void deleteByUser(User user);
}
