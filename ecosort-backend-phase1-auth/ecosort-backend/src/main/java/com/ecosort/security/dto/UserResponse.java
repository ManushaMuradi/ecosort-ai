package com.ecosort.security.dto;

import com.ecosort.security.entity.User;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Outbound representation of a User. Deliberately excludes passwordHash
 * — this is the other half of the DTO safety story: RegisterRequest
 * controls what comes IN, UserResponse controls what goes OUT, so a
 * password hash can never accidentally be serialized into a JSON
 * response even if a developer later adds fields carelessly to User.
 */
public record UserResponse(
        UUID id,
        String email,
        String fullName,
        String phone,
        String status,
        Set<String> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getStatus().name(),
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toSet())
        );
    }
}
