package com.pekings.pos.oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security Configuration class for setting up HTTP security and role-based authorization.
 * This configuration leverages JWT-based authentication and assigns specific roles to certain endpoints
 * based on the user's position (Manager, Cashier, or Kitchen).
 */
@Configuration
public class SecurityConfiguration {

    private static final String[] MANAGER_REQUESTS;
    private static final String[] CASHIER_REQUESTS;
    private static final String[] KITCHEN_REQUESTS;

    static {
        // Define API endpoint patterns that require specific roles
        MANAGER_REQUESTS = new String[] {
                "/api/employee/all",
                "/api/employee/add",
                "/api/employee/update",
                "/api/employee/delete",

                "/api/inventory/top",
                "/api/inventory/update/**",
                "/api/inventory/update",
                "/api/inventory/add",
                "/api/inventory/delete",

                "/api/menuitem/top",
                "/api/menuitem/add",
                "/api/menuitem/update",
                "/api/menuitem/delete",

                "/api/orders/delete",
                "/api/orders/customer/**",
                "/api/orders/past/day"
        };

        CASHIER_REQUESTS = new String[] {
                "/api/orders/update/**",
                "/api/orders/update",
                "/api/orders/*/menuitems",
        };

        KITCHEN_REQUESTS = new String[] {
                "/api/orders/status/**",
        };
    }

    private final JwtAuthProvider customJwtProvider;

    @Autowired
    public SecurityConfiguration(JwtAuthProvider customJwtProvider) {
        this.customJwtProvider = customJwtProvider;
    }

    /**
     * Configures HTTP security for the application.
     * Defines role-based access control for specific API endpoints and enables JWT authentication.
     *
     * @param http The {@link HttpSecurity} object used to configure the security settings.
     * @return The configured {@link SecurityFilterChain} instance.
     * @throws Exception If an error occurs during configuration.
     */
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(req -> req
                        .requestMatchers(MANAGER_REQUESTS).hasAuthority("ROLE_MANAGER")
                        .requestMatchers(CASHIER_REQUESTS).hasAuthority("ROLE_CASHIER")
                        .requestMatchers(KITCHEN_REQUESTS).hasAuthority("ROLE_KITCHEN")
                        .anyRequest().permitAll() // All other requests are allowed without authentication
                )
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults()) // Enable cross-origin resource sharing (CORS)
                .oauth2ResourceServer(resourceServer -> resourceServer
                        .jwt(jwtConfigurer -> jwtConfigurer.authenticationManager(customJwtProvider))) // Use JWT for authentication
                .build();
    }
}

