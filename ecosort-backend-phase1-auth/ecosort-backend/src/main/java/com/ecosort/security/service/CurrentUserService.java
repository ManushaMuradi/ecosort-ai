package com.ecosort.security.service;

import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.security.entity.User;
import com.ecosort.security.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

/**
 * Resolves the current Authentication into our domain User entity.
 * Spring Security's Authentication.getPrincipal() returns its OWN
 * UserDetails (built by CustomUserDetailsService), never our JPA
 * entity — every controller that needs the caller's id (Address,
 * WasteRequest, and future modules) goes through this one helper
 * instead of each re-deriving "getName() -> findByEmail()" itself.
 */
@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User resolve(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));
    }
}

