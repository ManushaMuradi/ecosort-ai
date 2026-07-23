package com.ecosort.wasterequest.controller;

import com.ecosort.common.dto.ApiResponse;
import com.ecosort.wasteknowledge.dto.response.PageResponse;
import com.ecosort.wasterequest.dto.request.AssignCollectorRequest;
import com.ecosort.wasterequest.dto.request.CancelRequestRequest;
import com.ecosort.wasterequest.dto.request.CreateWasteRequestRequest;
import com.ecosort.wasterequest.dto.request.UpdateStatusRequest;
import com.ecosort.wasterequest.dto.response.RequestStatusHistoryResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse;
import com.ecosort.wasterequest.entity.WasteRequestStatus;
import com.ecosort.wasterequest.service.WasteRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Thin HTTP adapter over WasteRequestService — every visibility rule,
 * transition rule, and cross-entity validation lives in the service;
 * this class only translates HTTP <-> service calls and declares
 * role-level authorization, mirroring every other controller in the
 * codebase (AuthController, WasteCategoryController, ...).
 *
 * Role mapping for this feature: USER = CITIZEN, ADMIN = MUNICIPAL_ADMIN
 * + SUPER_ADMIN (both), COLLECTOR = COLLECTOR (unchanged).
 */
@RestController
@RequestMapping("/api/v1/waste-requests")
@Tag(name = "Waste Requests", description = "Citizen pickup requests, collector assignment, and status workflow")
public class WasteRequestController {

    private final WasteRequestService wasteRequestService;

    public WasteRequestController(WasteRequestService wasteRequestService) {
        this.wasteRequestService = wasteRequestService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "Submit a new pickup request with one or more waste items")
    public ResponseEntity<ApiResponse<WasteRequestResponse>> create(
            @Valid @RequestBody CreateWasteRequestRequest request,
            Authentication authentication) {
        WasteRequestResponse response = wasteRequestService.create(authentication, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Pickup request submitted"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "Get a single pickup request",
            description = "Visible to its owning citizen, its assigned collector, or any admin — the service returns 404 (not 403) for anyone else, so existence isn't leaked."
    )
    public ResponseEntity<ApiResponse<WasteRequestResponse>> getById(
            @Parameter(description = "Waste request id") @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(wasteRequestService.getById(authentication, id)));
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get the status transition timeline for a pickup request")
    public ResponseEntity<ApiResponse<List<RequestStatusHistoryResponse>>> getHistory(
            @Parameter(description = "Waste request id") @PathVariable UUID id,
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(wasteRequestService.getHistory(authentication, id)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(summary = "List the current citizen's own pickup requests")
    public ResponseEntity<ApiResponse<PageResponse<WasteRequestSummaryResponse>>> getMyRequests(
            @Parameter(description = "Optional status filter") @RequestParam(required = false) WasteRequestStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable,
            Authentication authentication) {
        var page = wasteRequestService.getMyRequests(authentication, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(page)));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('COLLECTOR')")
    @Operation(summary = "List pickup requests assigned to the current collector")
    public ResponseEntity<ApiResponse<PageResponse<WasteRequestSummaryResponse>>> getAssignedRequests(
            @Parameter(description = "Optional status filter") @RequestParam(required = false) WasteRequestStatus status,
            @ParameterObject @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        var page = wasteRequestService.getAssignedRequests(authentication, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(page)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MUNICIPAL_ADMIN','SUPER_ADMIN')")
    @Operation(summary = "List all pickup requests platform-wide (admin)")
    public ResponseEntity<ApiResponse<PageResponse<WasteRequestSummaryResponse>>> getAllRequests(
            @Parameter(description = "Optional status filter") @RequestParam(required = false) WasteRequestStatus status,
            @ParameterObject @PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        var page = wasteRequestService.getAllRequests(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(PageResponse.from(page)));
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('MUNICIPAL_ADMIN','SUPER_ADMIN')")
    @Operation(
            summary = "Assign a collector to a REQUESTED pickup request",
            description = "Atomically sets the collector and transitions REQUESTED -> SCHEDULED. Fails if the request isn't currently REQUESTED, or if the target user doesn't hold the COLLECTOR role."
    )
    public ResponseEntity<ApiResponse<WasteRequestResponse>> assignCollector(
            @Parameter(description = "Waste request id") @PathVariable UUID id,
            @Valid @RequestBody AssignCollectorRequest request,
            Authentication authentication) {
        WasteRequestResponse response = wasteRequestService.assignCollector(authentication, id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Collector assigned"));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('COLLECTOR','MUNICIPAL_ADMIN','SUPER_ADMIN')")
    @Operation(
            summary = "Progress a pickup request's status (SCHEDULED -> COLLECTED -> VERIFIED)",
            description = "A collector may only progress a request assigned to them; admins may progress any request. SCHEDULED and CANCELLED are not reachable here — use /assign and /cancel respectively."
    )
    public ResponseEntity<ApiResponse<WasteRequestResponse>> updateStatus(
            @Parameter(description = "Waste request id") @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request,
            Authentication authentication) {
        WasteRequestResponse response = wasteRequestService.updateStatus(authentication, id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Status updated"));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CITIZEN')")
    @Operation(
            summary = "Cancel a pickup request",
            description = "Only the owning citizen may cancel, and only while the request is still REQUESTED (not yet assigned)."
    )
    public ResponseEntity<ApiResponse<WasteRequestResponse>> cancel(
            @Parameter(description = "Waste request id") @PathVariable UUID id,
            @Valid @RequestBody CancelRequestRequest request,
            Authentication authentication) {
        WasteRequestResponse response = wasteRequestService.cancel(authentication, id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Pickup request cancelled"));
    }
}
