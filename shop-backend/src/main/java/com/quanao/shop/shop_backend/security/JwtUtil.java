package com.quanao.shop.shop_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import com.quanao.shop.shop_backend.config.AppProperties;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final AppProperties props;

    public JwtUtil(AppProperties props) {
        this.props = props;
    }

    private SecretKey key() {
        String secret = props.getJwt().getSecret();
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username, String role) {
        long expirationMs = props.getJwt().getExpirationMs();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(key())
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
