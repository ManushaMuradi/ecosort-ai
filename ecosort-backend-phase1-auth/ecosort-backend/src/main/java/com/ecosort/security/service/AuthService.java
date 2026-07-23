package com.ecosort.security.service;

import com.ecosort.security.dto.*;

/**
 * Contract for authentication use cases. The controller depends on
 * this interface, not on AuthServiceImpl directly — Dependency
 * Inversion, and it's what lets us mock AuthService cleanly in
 * AuthControllerTest without spinning up real security machinery.
 */
public interface AuthService {

    UserResponse register(RegisterRequest request);

    JwtResponse login(LoginRequest request);

    JwtResponse refresh(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);

    UserResponse getCurrentUser(String email);
}
