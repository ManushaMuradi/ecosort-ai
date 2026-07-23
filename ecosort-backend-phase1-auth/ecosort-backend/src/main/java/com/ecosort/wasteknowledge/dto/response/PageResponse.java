package com.ecosort.wasteknowledge.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Standard pagination envelope, nested inside ApiResponse.data for
 * every list endpoint across the application (not specific to the
 * Waste Knowledge Base module — placed in common/dto so every future
 * module reuses the same shape instead of each inventing its own).
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}