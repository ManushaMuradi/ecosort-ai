package com.ecosort.security.controller;

import com.ecosort.common.dto.ApiResponse;
import com.ecosort.security.dto.UserResponse;
import com.ecosort.security.entity.RoleName;
import com.ecosort.security.service.UserQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * User lookup endpoints, separate from AuthController (which owns
 * authentication actions — register/login/refresh/logout/me, not
 * general user queries). Currently one endpoint: listing active users
 * by role, added specifically for the Waste Request module's
 * Assign-Collector dropdown, but kept generic (not a single-purpose
 * "/collectors" endpoint) since "list active users holding role X" is
 * a genuinely reusable admin capability.
 */
@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "Administrative user lookup")
public class UserController {

    private final UserQueryService userQueryService;

    public UserController(UserQueryService userQueryService) {
        this.userQueryService = userQueryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MUNICIPAL_ADMIN','SUPER_ADMIN')")
    @Operation(
            summary = "List active users holding a given role",
            description = "Admin-only. Used by the Assign Collector UI to populate a dropdown of active COLLECTOR-role users, but works for any role. Only ACTIVE users are returned — a SUSPENDED account is never assignable."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid or missing role parameter"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<ApiResponse<List<UserResponse>>> listByRole(
            @Parameter(description = "Role to filter by", example = "COLLECTOR", required = true)
            @RequestParam RoleName role) {
        return ResponseEntity.ok(ApiResponse.success(userQueryService.listByRole(role)));
    }
}
