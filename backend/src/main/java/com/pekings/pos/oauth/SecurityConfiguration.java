package com.pekings.pos.oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    private static final String[] PUBLIC_REQUESTS;
    private static final String[] MANAGER_REQUESTS;
    private static final String[] CASHIER_REQUESTS;
    private static final String[] KITCHEN_REQUESTS;

    static {
         PUBLIC_REQUESTS = new String[] {
                 "/api/menuitem/all",
                 "/api/menuitem/**/ingredients",
                 "/api/menuitem/category/**",
         };

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
                "/api/orders/customer/**"
        };

        CASHIER_REQUESTS = new String[] {
                "/api/orders/add",
                "/api/orders/update/**",
                "/api/orders/update",
                "/api/orders/**/menuitems",
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

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(req -> req
                        .requestMatchers(MANAGER_REQUESTS).hasAuthority("ROLE_MANAGER")
                        .requestMatchers(CASHIER_REQUESTS).hasAuthority("ROLE_CASHIER")
                        .requestMatchers(KITCHEN_REQUESTS).hasAuthority("ROLE_KITCHEN")
                        .requestMatchers(PUBLIC_REQUESTS).permitAll()
                        .anyRequest().authenticated()
                )
                .cors(Customizer.withDefaults())
                .oauth2ResourceServer(resourceServer -> resourceServer
                        .jwt(jwtConfigurer -> jwtConfigurer.authenticationManager(customJwtProvider)))
                .build();
    }
}

