package com.ecosort.wasteknowledge.service;

import com.ecosort.wasteknowledge.dto.request.CreateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.response.WasteItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Contract for waste item management and lookup use cases. Controllers
 * depend on this interface, never on the implementation directly
 * (Dependency Inversion) — mirrors WasteCategoryService.
 */
public interface WasteItemService {

    WasteItemResponse create(CreateWasteItemRequest request);

    WasteItemResponse update(UUID id, UpdateWasteItemRequest request);

    void delete(UUID id);

    WasteItemResponse getById(UUID id);

    Page<WasteItemResponse> getAll(Pageable pageable);

    Page<WasteItemResponse> getByCategory(UUID categoryId, Pageable pageable);

    Page<WasteItemResponse> search(String keyword, Pageable pageable);
}