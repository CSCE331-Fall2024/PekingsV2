package com.pekings.pos.oauth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.resource.OAuth2ResourceServerConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

import java.util.ArrayList;
import java.util.Collection;

@Configuration
public class SecurityConfiguration {

    private static final String AUTH0_ISSUER = "https://dev-qqi54n0xtmhjjy7l.us.auth0.com/";
    private static final String AUTH0_AUDIENCE = "https://auth.pekings.ceedric.dev";

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

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(req -> req
                        .requestMatchers(MANAGER_REQUESTS).hasAuthority("ROLE_MANAGER")
                        .requestMatchers(CASHIER_REQUESTS).hasAuthority("ROLE_CASHIER")
                        .anyRequest().permitAll()
                )
                .cors(Customizer.withDefaults())
                .oauth2Login(oauth2 -> oauth2
                        .successHandler((request, response, authentication) -> {
                    OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
                    OAuth2AuthenticationToken enhancedToken = new CustomJwtAuthConverter().enhanceAuthenticationToken(token);
                    SecurityContextHolder.getContext().setAuthentication(enhancedToken);
                }))
                .build();
    }

    @Bean
    public JwtAuthenticationConverter customJwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthConverter());
        return converter;
    }
}
