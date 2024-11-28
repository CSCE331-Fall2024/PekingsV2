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

@Component
public class JwtAuthProvider implements AuthenticationManager {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        BearerTokenAuthenticationToken token = (BearerTokenAuthenticationToken) authentication;
        Jwt jwt = jwtDecoder().decode(token.getToken());

        String email = jwt.getClaimAsString("email");
        Employee employee = employeeRepository.findByEmail(email);

        Collection<GrantedAuthority> authorities = new ArrayList<>(token.getAuthorities());

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

        JwtAuthenticationToken jwtAuthenticationToken = new JwtAuthenticationToken(jwt, authorities);
        jwtAuthenticationToken.setAuthenticated(true);
        SecurityContextHolder.getContext().setAuthentication(jwtAuthenticationToken);

        return jwtAuthenticationToken;
    }

    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withJwkSetUri("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/.well-known/jwks.json").build();

        // Validate the 'aud' claim
        jwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer("https://dev-qqi54n0xtmhjjy7l.us.auth0.com/"));

        return jwtDecoder;
    }
}
