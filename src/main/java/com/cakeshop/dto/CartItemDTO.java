package com.cakeshop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Long id;
    private Long cakeId;
    private String cakeName;
    private BigDecimal cakePrice;
    private String cakeImageUrl;
    private Integer quantity;
    private BigDecimal subtotal;
}
