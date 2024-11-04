package com.pekings.pos.oauth;

import com.pekings.pos.entities.Employee;
import com.pekings.pos.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class OAuthController extends DefaultOAuth2UserService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CustomLogoutSuccessHandler logoutSuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/manager/**").hasRole("MANAGER")
                        .requestMatchers("/cashier/**").hasRole("CASHIER")
                        .requestMatchers("/user/**").hasRole("USER")
                        .requestMatchers("/", "/login").permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(configurer -> configurer
                        .loginPage("/login")
                        .defaultSuccessUrl("/"))
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessHandler(logoutSuccessHandler)
                        .invalidateHttpSession(true)
                        .clearAuthentication(true))
                .exceptionHandling(exception -> exception.accessDeniedPage("/access-denied"));
        return http.build();
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Default role assignment
        Set<GrantedAuthority> authorities = new HashSet<>(oAuth2User.getAuthorities());
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

        String email = oAuth2User.getAttribute("email");
        Employee employee = employeeRepository.findByEmail(email);

        if (employee != null) {
            if (employee.getPosition().equalsIgnoreCase("employee")) {
                authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
            }

            if (employee.getPosition().equalsIgnoreCase("manager")) {
                authorities.add(new SimpleGrantedAuthority("ROLE_CASHIER"));
                authorities.add(new SimpleGrantedAuthority("ROLE_MANAGER"));
            }
        }

        return new DefaultOAuth2User(authorities, oAuth2User.getAttributes(), "sub");
    }

}
