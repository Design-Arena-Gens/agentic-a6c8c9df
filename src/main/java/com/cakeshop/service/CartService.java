package com.cakeshop.service;

import com.cakeshop.dto.CartItemDTO;
import com.cakeshop.model.Cake;
import com.cakeshop.model.CartItem;
import com.cakeshop.model.User;
import com.cakeshop.repository.CakeRepository;
import com.cakeshop.repository.CartItemRepository;
import com.cakeshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CakeRepository cakeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CartItemDTO> getCartItems(String email) {
        User user = getUserByEmail(email);
        List<CartItem> items = cartItemRepository.findByUser(user);

        return items.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public CartItemDTO addToCart(String email, Long cakeId, Integer quantity) {
        User user = getUserByEmail(email);
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new RuntimeException("Cake not found"));

        CartItem cartItem = cartItemRepository.findByUserAndCakeId(user, cakeId)
                .orElse(new CartItem());

        if (cartItem.getId() == null) {
            cartItem.setUser(user);
            cartItem.setCake(cake);
            cartItem.setQuantity(quantity);
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }

        cartItemRepository.save(cartItem);
        return convertToDTO(cartItem);
    }

    @Transactional
    public CartItemDTO updateCartItem(String email, Long itemId, Integer quantity) {
        User user = getUserByEmail(email);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return convertToDTO(cartItem);
    }

    @Transactional
    public void removeFromCart(String email, Long itemId) {
        User user = getUserByEmail(email);
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        cartItemRepository.deleteByUser(user);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private CartItemDTO convertToDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(item.getId());
        dto.setCakeId(item.getCake().getId());
        dto.setCakeName(item.getCake().getName());
        dto.setCakePrice(item.getCake().getPrice());
        dto.setCakeImageUrl(item.getCake().getImageUrl());
        dto.setQuantity(item.getQuantity());
        dto.setSubtotal(item.getCake().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return dto;
    }
}
