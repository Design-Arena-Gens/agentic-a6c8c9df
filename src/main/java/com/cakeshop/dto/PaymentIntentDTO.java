package com.cakeshop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentIntentDTO {
    private String clientSecret;
    private String paymentIntentId;
    private BigDecimal amount;
}
