package com.ecosort.wasteknowledge.service;

import com.ecosort.wasteknowledge.dto.request.CreateCategoryRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateCategoryRequest;
import com.ecosort.wasteknowledge.dto.response.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Contract for waste category management use cases. Controllers depend
 * on this interface, never on the implementation directly (Dependency
 * Inversion) — mirrors AuthService from the security module.
 */
public interface WasteCategoryService {

    CategoryResponse create(CreateCategoryRequest request);

    CategoryResponse update(UUID id, UpdateCategoryRequest request);

    void delete(UUID id);

    CategoryResponse getById(UUID id);

    Page<CategoryResponse> getAll(Pageable pageable);
}