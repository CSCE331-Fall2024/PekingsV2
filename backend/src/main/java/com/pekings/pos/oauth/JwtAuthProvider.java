package com.pekings.pos.oauth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthProvider implements AuthenticationManager {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        BearerTokenAuthenticationToken token = (BearerTokenAuthenticationToken) authentication;
        Jwt jwt = jwtDecoder().decode(token.getToken());

        Collection<GrantedAuthority> authorities = new ArrayList<>(token.getAuthorities());

        List<String> roles = jwt.getClaimAsStringList("https://auth.pekings.ceedric.dev/roles");

        if (roles.contains("manager")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
            authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
            authorities.add(new SimpleGrantedAuthority("ROLE_KITCHEN"));
        } else if (roles.contains("cashier")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
        } else if (roles.contains("kitchen")) {
            authorities.add(new SimpleGrantedAuthority("ROLE_KITCHEN"));
        }

        return new JwtAuthenticationToken(jwt, authorities);
    }

    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/.well-known/jwks.json").build();

        // Validate the 'aud' claim
        jwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/"));

        return jwtDecoder;
    }
}
