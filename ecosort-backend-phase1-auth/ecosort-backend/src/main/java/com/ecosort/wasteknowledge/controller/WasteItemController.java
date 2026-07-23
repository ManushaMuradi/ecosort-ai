package com.ecosort.wasteknowledge.controller;

import com.ecosort.common.dto.ApiResponse;
import com.ecosort.wasteknowledge.dto.response.PageResponse;
import com.ecosort.wasteknowledge.dto.request.CreateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.response.WasteItemResponse;
import com.ecosort.wasteknowledge.service.WasteItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
 * Thin HTTP adapter over {@link WasteItemService}. Contains no business
 * logic — every decision (duplicate names within a category, category
 * existence validation) is made in the service layer; this class only
 * handles request/response translation and authorization, mirroring
 * WasteCategoryController and AuthController.
 */
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/waste-items")
@Tag(name = "Waste Items", description = "Manage and search individual waste items and their disposal guidance")
public class WasteItemController {

    private final WasteItemService itemService;

    public WasteItemController(WasteItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MUNICIPAL_ADMIN')")
    @Operation(
            summary = "Create a waste item",
            description = "Creates a new waste item under an existing category. Accessible to SUPER_ADMIN and MUNICIPAL_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Waste item created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Referenced category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Item name already exists in this category"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Validation failed"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<ApiResponse<WasteItemResponse>> create(@Valid @RequestBody CreateWasteItemRequest request) {
        WasteItemResponse response = itemService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Waste item created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','MUNICIPAL_ADMIN')")
    @Operation(
            summary = "Update a waste item",
            description = "Updates an existing waste item by id, including moving it to a different category. Accessible to SUPER_ADMIN and MUNICIPAL_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Waste item updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Waste item or referenced category not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Item name already exists in this category"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Validation failed")
    })
    public ResponseEntity<ApiResponse<WasteItemResponse>> update(
            @Parameter(description = "Waste item id") @PathVariable UUID id,
            @Valid @RequestBody UpdateWasteItemRequest request) {
        WasteItemResponse response = itemService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Waste item updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(
            summary = "Delete a waste item",
            description = "Deletes a waste item by id. Accessible to SUPER_ADMIN only."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Waste item deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Waste item not found")
    })
    public ResponseEntity<Void> delete(@Parameter(description = "Waste item id") @PathVariable UUID id) {
        itemService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "Get a waste item by id",
            description = "Retrieves a single waste item, including its category summary and disposal/recycling guidance. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Waste item found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Waste item not found")
    })
    public ResponseEntity<ApiResponse<WasteItemResponse>> getById(
            @Parameter(description = "Waste item id") @PathVariable UUID id) {
        WasteItemResponse response = itemService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "List all waste items",
            description = "Retrieves a paginated list of all waste items across every category. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Waste items retrieved")
    })
    public ResponseEntity<ApiResponse<PageResponse<WasteItemResponse>>> getAll(
            @ParameterObject @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        PageResponse<WasteItemResponse> response = PageResponse.from(itemService.getAll(pageable));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "Search waste items by keyword",
            description = "Case-insensitive search over item name and scientific name. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search results retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "422", description = "Blank search keyword")
    })
    public ResponseEntity<ApiResponse<PageResponse<WasteItemResponse>>> search(
            @Parameter(description = "Search keyword, matched against item name and scientific name", example = "battery")
            @RequestParam String keyword,
            @ParameterObject @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        PageResponse<WasteItemResponse> response = PageResponse.from(itemService.search(keyword, pageable));
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Nested resource under /api/v1/categories, not /waste-items — kept
     * in this controller (not WasteCategoryController) because the
     * response is a page of WasteItemResponse and the call ultimately
     * delegates to WasteItemService, keeping each controller aligned
     * with the service/response type it primarily returns.
     */
    @GetMapping("/category/{categoryId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "List waste items in a category",
            description = "Retrieves a paginated list of waste items belonging to a specific category. Accessible to any authenticated user."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Waste items retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Category not found")
    })
    public ResponseEntity<ApiResponse<PageResponse<WasteItemResponse>>> getByCategory(
            @Parameter(description = "Category id") @PathVariable UUID categoryId,
            @ParameterObject @PageableDefault(size = 20, sort = "name") Pageable pageable) {
        PageResponse<WasteItemResponse> response = PageResponse.from(itemService.getByCategory(categoryId, pageable));
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
