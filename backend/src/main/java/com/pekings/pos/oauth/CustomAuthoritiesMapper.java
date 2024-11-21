package com.pekings.pos.oauth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class CustomAuthoritiesMapper implements GrantedAuthoritiesMapper {

    @Override
    public Collection<? extends GrantedAuthority> mapAuthorities(Collection<? extends GrantedAuthority> authorities) {
        // Example: Assign roles based on domain or other claims
        Set<GrantedAuthority> mappedAuthorities = new HashSet<>(authorities);

        // Extract user information from the OAuth2AuthenticationToken
        authorities.forEach(authority -> {
            if (authority instanceof OAuth2UserAuthority) {
                OAuth2UserAuthority oauth2UserAuthority = (OAuth2UserAuthority) authority;
                Map<String, Object> attributes = oauth2UserAuthority.getAttributes();

                String email = (String) attributes.get("email");
                if (email != null && email.endsWith("@example.com")) {
                    mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
                }
            }
        });

        mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return mappedAuthorities;
    }
}
