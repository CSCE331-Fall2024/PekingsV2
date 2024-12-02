package com.pekings.pos.oauth;

import com.pekings.pos.entities.Employee;
import com.pekings.pos.repository.EmployeeRepository;
import com.pekings.pos.util.Position;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Custom AuthenticationManager implementation for JWT-based authentication.
 * This class integrates with Spring Security to authenticate users based on JWT tokens
 * and assigns roles based on employee positions.
 */
@Component
public class JwtAuthProvider implements AuthenticationManager {

    @Autowired
    private EmployeeRepository employeeRepository;

    /**
     * Authenticates a user based on a provided JWT token.
     *
     * @param authentication An instance of {@link Authentication}, expected to be of type {@link BearerTokenAuthenticationToken}.
     * @return An authenticated {@link JwtAuthenticationToken} containing the user's roles and permissions.
     * @throws AuthenticationException If authentication fails due to an invalid or missing token.
     */
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // Extract the JWT token from the Bearer token
        BearerTokenAuthenticationToken token = (BearerTokenAuthenticationToken) authentication;
        Jwt jwt = jwtDecoder().decode(token.getToken());

        // Retrieve email from JWT claims
        String email = jwt.getClaimAsString("email");
        Employee employee = employeeRepository.findByEmail(email);

        // Initialize authorities from the token
        Collection<GrantedAuthority> authorities = new ArrayList<>(token.getAuthorities());

        // Assign roles based on employee position
        if (employee != null) {
            Position position = employee.getPosition();
            switch (position) {
                case MANAGER -> {
                    authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
                    authorities.add(new SimpleGrantedAuthority("ROLE_KITCHEN"));
                }

                case CASHIER -> authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
                case KITCHEN -> authorities.add(new SimpleGrantedAuthority("ROLE_KITCHEN"));
            }
        }

        // Create and return the authenticated token
        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(jwt, authorities);
        jwtAuthenticationToken.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(jwtAuthenticationToken);

        return jwtAuthenticationToken;
    }

    /**
     * Creates a {@link JwtDecoder} for decoding and validating JWT tokens.
     *
     * - Configures the decoder with the JWK Set URI of the Auth0 issuer.
     * - Validates the issuer and audience claims in the JWT.
     *
     * @return A configured {@link JwtDecoder} instance.
     */
    public JwtDecoder jwtDecoder() {
        // Configure NimbusJwtDecoder with JWK Set URI
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder
                .withJwkSetUri("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/.well-known/jwks.json")
                .build();

        // Validate the 'aud' claim with the issuer
        jwtDecoder.setJwtValidator(
                JwtValidators.createDefaultWithIssuer("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/")
        );

        return jwtDecoder;
    }
}
