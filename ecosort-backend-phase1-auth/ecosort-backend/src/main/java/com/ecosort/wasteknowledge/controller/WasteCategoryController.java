package com.ecosort.wasteknowledge.controller;

import com.ecosort.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import com.ecosort.wasteknowledge.dto.response.PageResponse;
import com.ecosort.wasteknowledge.dto.request.CreateCategoryRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateCategoryRequest;
import com.ecosort.wasteknowledge.dto.response.CategoryResponse;
import com.ecosort.wasteknowledge.service.WasteCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Thin HTTP adapter over {@link WasteCategoryService}. Contains no
 * business logic — every decision (duplicate names, delete-in-use
 * protection) is made in the service layer; this class only handles
 * request/response translation and authorization, mirroring
 * AuthController from the security module.
 */
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Waste Categories", description = "Manage and browse the waste category taxonomy")
public class WasteCategoryController {

    private final WasteCategoryService categoryService;

    public WasteCategoryController(WasteCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MUNICIPAL_ADMIN')")
    @Operation(
            summary = "Create a waste category",
            description = "Creates a new waste category. Accessible to SUPER_ADMIN and MUNICIPAL_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Category created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Category name already exists"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Validation failed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<ApiResponse<CategoryResponse>> create(@Valid @RequestBody CreateCategoryRequest request) {
        CategoryResponse response = categoryService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Category created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MUNICIPAL_ADMIN')")
    @Operation(
            summary = "Update a waste category",
            description = "Updates an existing waste category by id. Accessible to SUPER_ADMIN and MUNICIPAL_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Category name already exists"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Validation failed")
    })
    public ResponseEntity<ApiResponse<CategoryResponse>> update(
            @Parameter(description = "Category id") @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        CategoryResponse response = categoryService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Category updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(
            summary = "Delete a waste category",
            description = "Deletes a waste category by id. Fails if the category still has waste items assigned to it. Accessible to SUPER_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Category deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Category still has waste items assigned")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Category id") @PathVariable UUID id) {
        categoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "Get a waste category by id",
            description = "Retrieves a single waste category. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Category found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponse<CategoryResponse>> getById(
            @Parameter(description = "Category id") @PathVariable UUID id) {
        System.out.println(">>> getById() called with id = " + id);
        CategoryResponse response = categoryService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "List all waste categories",
            description = "Retrieves a paginated list of all waste categories. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Categories retrieved")
    })
    public ResponseEntity<ApiResponse<PageResponse<CategoryResponse>>> getAll(
            @ParameterObject @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        PageResponse<CategoryResponse> response = PageResponse.from(categoryService.getAll(pageable));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}