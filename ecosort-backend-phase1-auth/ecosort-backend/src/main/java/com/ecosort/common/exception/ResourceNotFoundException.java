package com.ecosort.common.exception;

/**
 * Thrown when a requested entity does not exist (e.g. user id not found).
 * Mapped to HTTP 404 by GlobalExceptionHandler.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException of(String entity, Object identifier) {
        return new ResourceNotFoundException(entity + " with id '" + identifier + "' was not found.");
    }
}
