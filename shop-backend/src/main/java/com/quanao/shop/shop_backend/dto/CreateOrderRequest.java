package com.quanao.shop.shop_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    private List<OrderItemRequest> items;

    private String shippingAddress;
    private String billingAddress;

    private String paymentMethod; // COD / BANK / ONLINE...

    private String voucherCode;
}
