package com.cakeshop.controller;

import com.cakeshop.dto.PaymentIntentDTO;
import com.cakeshop.model.Order;
import com.cakeshop.service.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<PaymentIntentDTO> createPaymentIntent(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            String shippingAddress = request.get("shippingAddress");
            PaymentIntentDTO dto = paymentService.createPaymentIntent(
                    authentication.getName(), shippingAddress);
            return ResponseEntity.ok(dto);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<Void> confirmPayment(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        paymentService.confirmPayment(paymentIntentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        List<Order> orders = paymentService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }
}
