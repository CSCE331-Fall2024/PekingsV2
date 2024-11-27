package com.pekings.pos.oauth;

import com.pekings.pos.entities.Employee;
import com.pekings.pos.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CustomJwtAuthConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Autowired
    private EmployeeRepository employeeRepository;

    public OAuth2AuthenticationToken enhanceAuthenticationToken(OAuth2AuthenticationToken token) {
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<>();

        String email = token.getPrincipal().getAttribute("email");
        Employee employee = employeeRepository.findByEmail(email);

        if (employee != null) {
            grantedAuthorities.add(new SimpleGrantedAuthority("ROLE_" + employee.getPosition().name().toUpperCase()));
        }

        grantedAuthorities.addAll(token.getAuthorities());

        return new OAuth2AuthenticationToken(token.getPrincipal(), grantedAuthorities, token.getAuthorizedClientRegistrationId());
    }

    @Override
    public Collection<GrantedAuthority> convert(Jwt source) {
        List<String> roles = source.getClaimAsStringList("roles");

        String email = (String) source.getClaims().get("email");
        Employee employee = employeeRepository.findByEmail(email);

        if (employee != null) {
            roles.add("ROLE_" + employee.getPosition().name().toUpperCase());
        }

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
