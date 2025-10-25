package com.cakeshop.controller;

import com.cakeshop.dto.CartItemDTO;
import com.cakeshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(Authentication authentication) {
        List<CartItemDTO> items = cartService.getCartItems(authentication.getName());
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<CartItemDTO> addToCart(
            @RequestBody Map<String, Object> request,
            Authentication authentication) {
        Long cakeId = Long.valueOf(request.get("cakeId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());

        CartItemDTO item = cartService.addToCart(authentication.getName(), cakeId, quantity);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<CartItemDTO> updateCartItem(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request,
            Authentication authentication) {
        CartItemDTO item = cartService.updateCartItem(
                authentication.getName(), itemId, request.get("quantity"));
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long itemId,
            Authentication authentication) {
        cartService.removeFromCart(authentication.getName(), itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
