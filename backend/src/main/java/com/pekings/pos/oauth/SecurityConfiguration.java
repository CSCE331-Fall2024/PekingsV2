package com.pekings.pos.oauth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    private static final String[] MANAGER_REQUESTS;
    private static final String[] CASHIER_REQUESTS;

    static {
        MANAGER_REQUESTS = new String[] {
                "/api/menuitem/top"
        };

        CASHIER_REQUESTS = new String[] {
                "/api/orders/add"
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
                        .anyRequest().permitAll()
                )
                .cors(Customizer.withDefaults())
                .oauth2ResourceServer(resourceServer -> resourceServer
                        .jwt(jwtConfigurer -> jwtConfigurer.authenticationManager(customJwtProvider)))
                .build();
    }
}
