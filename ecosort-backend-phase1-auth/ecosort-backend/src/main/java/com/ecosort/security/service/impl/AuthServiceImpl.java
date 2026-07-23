package com.ecosort.security.service.impl;

import com.ecosort.common.exception.BusinessRuleException;
import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.security.dto.*;
import com.ecosort.security.entity.RefreshToken;
import com.ecosort.security.entity.Role;
import com.ecosort.security.entity.RoleName;
import com.ecosort.security.entity.User;
import com.ecosort.security.jwt.JwtTokenProvider;
import com.ecosort.security.repository.RefreshTokenRepository;
import com.ecosort.security.repository.RoleRepository;
import com.ecosort.security.repository.UserRepository;
import com.ecosort.security.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

/**
 * Where the actual business rules of authentication live. The
 * controller stays a thin HTTP adapter; every decision ("is this email
 * taken", "what role does a new user get", "is this refresh token
 * still usable") is made here, so it's independently unit-testable
 * with mocked repositories/dependencies.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final long REFRESH_TOKEN_VALIDITY_DAYS = 7;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(UserRepository userRepository,
                            RoleRepository roleRepository,
                            RefreshTokenRepository refreshTokenRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager,
                            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            // 409 Conflict via GlobalExceptionHandler — a clear, specific
            // business rule violation, not a generic 400 or 500.
            throw new BusinessRuleException("An account with this email already exists");
        }

        Role citizenRole = roleRepository.findByName(RoleName.CITIZEN)
                .orElseThrow(() -> new IllegalStateException(
                        "CITIZEN role missing — check Flyway seed migration"));

        User user = new User();
        user.setEmail(request.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName().trim());
        user.setPhone(request.phone());
        user.setRoles(Set.of(citizenRole)); // FR9: default role only, never client-chosen

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }

    @Override
    @Transactional
    public JwtResponse login(LoginRequest request) {
        // Delegates the actual credential check to Spring Security's
        // AuthenticationManager -> DaoAuthenticationProvider -> our
        // CustomUserDetailsService + PasswordEncoder. We don't hand-roll
        // password comparison here; reuse the framework's vetted path.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.email()));

        return issueTokens(user);
    }

    @Override
    @Transactional
    public JwtResponse refresh(RefreshTokenRequest request) {
        RefreshToken existing = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new BusinessRuleException("Invalid refresh token"));

        if (!existing.isUsable()) {
            throw new BusinessRuleException("Refresh token expired or revoked — please log in again");
        }

        // Rotate: revoke the used token and issue a brand new pair.
        // Rotation limits the blast radius if a refresh token is ever
        // intercepted — it can only be used once before being invalidated.
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);

        return issueTokens(existing.getUser());
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.revokeByToken(request.refreshToken());
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ResourceNotFoundException.of("User", email));
        return UserResponse.from(user);
    }

    private JwtResponse issueTokens(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail(), user.getId().toString());

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plus(REFRESH_TOKEN_VALIDITY_DAYS, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshToken);

        return JwtResponse.of(accessToken, refreshToken.getToken(), jwtTokenProvider.getAccessTokenValiditySeconds());
    }
}
