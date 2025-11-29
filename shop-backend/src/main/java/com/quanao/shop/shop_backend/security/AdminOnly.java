package com.quanao.shop.shop_backend.security;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface AdminOnly {
}