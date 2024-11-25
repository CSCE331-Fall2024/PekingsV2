package com.pekings.pos.oauth;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomJwtAuthConverter {

    private static final String NAMESPACE = "https://auth.pekings.ceedric.dev/roles";

    public OAuth2AuthenticationToken enhanceAuthenticationToken(OAuth2AuthenticationToken token) {
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        token.getPrincipal().getAttributes().forEach((s, o) -> {
            if (!s.equals(NAMESPACE))
                return;

            if (!(o instanceof Collection<?> ls))
                return;

            ls.forEach(o1 -> {
                grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + ((String) o1).toUpperCase()));
            });
        });

        // Add existing authorities (like SCOPE_*)
        grantedAuthorities.addAll(token.getAuthorities());

        return new OAuth2AuthenticationToken(
                token.getPrincipal(),
                grantedAuthorities,
                token.getAuthorizedClientRegistrationId()
        );
    }

}
