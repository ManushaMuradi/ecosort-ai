package com.ecosort.common.exception;

/**
 * Thrown when a request is well-formed but violates a business rule
 * (e.g. "email already registered", "refresh token expired").
 * Mapped to HTTP 409/400 by GlobalExceptionHandler, distinct from
 * validation errors and from unexpected system failures.
 */
public class BusinessRuleException extends RuntimeException {

    public BusinessRuleException(String message) {
        super(message);
    }
}
