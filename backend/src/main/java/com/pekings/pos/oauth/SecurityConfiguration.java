package com.pekings.pos.oauth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import java.io.IOException;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration {

    @Value("${okta.oauth2.issuer}")
    private String issuer;

    @Value("${okta.oauth2.client-id}")
    private String clientId;

    @Bean
    public SecurityFilterChain configure(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests((requests) -> requests
                // allow anonymous access to the root page
                .requestMatchers("/").permitAll()
                // authenticate all other requests
                .anyRequest().authenticated());
        // configure logout handler
        http.logout(logout -> logout.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .addLogoutHandler(oidcLogoutHandler()));
        // enable OAuth2/OIDC
        http.oauth2Login(withDefaults());

        return http.build();
    }

    LogoutHandler oidcLogoutHandler() {
        return (request, response, authentication) -> {
            try {
                response.sendRedirect(issuer + "v2/logout?client_id=" + clientId + "&returnTo=http://localhost:8080/");
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        };
    }

}
