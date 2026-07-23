package com.ecosort.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Inbound payload for POST /auth/register.
 * A DTO, never the User entity itself — the client should never be able
 * to send fields like "roles" or "status" and have them bound directly
 * onto a persisted entity (mass-assignment vulnerability).
 */
public record RegisterRequest(

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "Password must contain at least one letter and one digit"
        )
        String password,

        @NotBlank(message = "Full name is required")
        @Size(max = 150)
        String fullName,

        @Pattern(regexp = "^$|^[0-9+\\-() ]{7,20}$", message = "Phone number is invalid")
        String phone
) {}
