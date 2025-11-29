package com.quanao.shop.shop_backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String phone;
    private String email;
}
