package com.pekings.pos.oauth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfiguration {

    private static final String[] MANAGER_REQUESTS;

    static {
        MANAGER_REQUESTS = new String[] {
                "/api/menuitem/top"
        };
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(req -> req
                        .requestMatchers(MANAGER_REQUESTS).hasAuthority("ROLE_MANAGER")
                        .anyRequest().permitAll()
                )
                .cors(Customizer.withDefaults())
                .oauth2Login(oauth2 -> oauth2.successHandler((request, response, authentication) -> {
                    OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
                    OAuth2AuthenticationToken enhancedToken = new CustomJwtAuthConverter().enhanceAuthenticationToken(token);
                    SecurityContextHolder.getContext().setAuthentication(enhancedToken);
                }))
                .build();
    }
}
