package com.quanao.shop.shop_backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(nullable = false)
    private String role;  // USER hoặc ADMIN

    @Column(length = 20)
    private String phone;

    @Column(length = 255, unique = true)
    private String email;

    @Column(length = 255)
    private String fullName;

    @Column(length = 16)
    private String gender;

    private java.time.LocalDate birthDate;

    @Column(length = 1024)
    private String avatarUrl;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailVerified = false; // Email verification status

    @Column(length = 100)
    private String emailVerificationCode; // Code để verify email
}
