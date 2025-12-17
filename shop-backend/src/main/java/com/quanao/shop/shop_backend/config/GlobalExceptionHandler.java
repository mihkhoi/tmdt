package com.quanao.shop.shop_backend.config;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, String>> handleExpiredJwtException(ExpiredJwtException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "JWT token has expired");
        error.put("message", "Please login again to get a new token");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, String>> handleJwtException(JwtException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid JWT token");
        error.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        Map<String, String> error = new HashMap<>();
        String message = e.getMessage();
        
        // Check if it's a JWT-related error
        if (message != null && (message.contains("JWT") || message.contains("token") || message.contains("Authorization"))) {
            error.put("error", "Authentication error");
            error.put("message", message);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
        
        // Other runtime exceptions
        error.put("error", "Internal server error");
        error.put("message", message != null ? message : "An unexpected error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
