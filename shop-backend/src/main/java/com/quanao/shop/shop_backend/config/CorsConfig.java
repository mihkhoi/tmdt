package com.quanao.shop.shop_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final AppProperties props;

    public CorsConfig(AppProperties props) {
        this.props = props;
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        var mapping = registry.addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
        String allowedOrigins = props.getCors().getAllowedOrigins();
        if (allowedOrigins == null || allowedOrigins.equals("*")) {
            mapping.allowedOriginPatterns("*");
        } else {
            String[] origins = java.util.Objects.requireNonNull(allowedOrigins).split(",");
            mapping.allowedOrigins(java.util.Objects.requireNonNull(origins));
        }
    }
}
