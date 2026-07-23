package com.ecosort.security.service;

import com.ecosort.security.entity.User;
import com.ecosort.security.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

/**
 * Adapter: converts our domain User into the UserDetails contract
 * Spring Security needs to perform authentication and authorization.S
 * This is the ONLY class in the codebase that knows both "User" (our
 * domain) and "UserDetails" (Spring Security's contract) — everywhere
 * else, these stay cleanly separated.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for: " + email));

        List<GrantedAuthority> authorities = Stream.concat(
        user.getRoles().stream()
                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role.getName().name())),
        user.getRoles().stream()
                .flatMap(role -> role.getPermissions().stream())
                .map(permission -> (GrantedAuthority) new SimpleGrantedAuthority(permission.getName()))
        ).distinct().toList();

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .disabled(user.getStatus() != com.ecosort.security.entity.UserStatus.ACTIVE)
                .authorities(authorities)
                .build();
    }
}
