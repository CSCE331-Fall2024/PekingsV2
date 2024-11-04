package com.pekings.pos.oauth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collections;
import java.util.Map;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class OAuthController {

    @GetMapping("/user")
    public Map<String, Object> user(@AuthenticationPrincipal OAuth2User principal) {
        return Collections.singletonMap("name", principal.getAttribute("name"));
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((authz) -> authz
                        .requestMatchers("/manager/**").hasRole("MANAGER")
                        .requestMatchers("/cashier/**").hasRole("CASHIER")
                        .requestMatchers("/user/**").hasRole("USER")
                        .anyRequest().authenticated()
                ).oauth2Login(configurer -> configurer.defaultSuccessUrl("/"))
                .exceptionHandling(exception -> exception.accessDeniedPage("/access-denied"));
        return http.build();
    }

}
