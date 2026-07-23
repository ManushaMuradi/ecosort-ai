package com.ecosort.address.controller;

import com.ecosort.address.dto.AddressResponse;
import com.ecosort.address.dto.CreateAddressRequest;
import com.ecosort.address.service.AddressService;
import com.ecosort.common.dto.ApiResponse;
import com.ecosort.security.service.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Minimal address book — exists here as a prerequisite for
 * WasteRequest creation (which requires an existing addressId), not as
 * a fully-featured address-management module. No update/delete yet;
 * add those when a real need surfaces rather than speculatively now.
 */
@RestController
@RequestMapping("/api/v1/addresses")
@Tag(name = "Addresses", description = "A citizen's saved pickup addresses")
public class AddressController {

    private final AddressService addressService;
    private final CurrentUserService currentUserService;

    public AddressController(AddressService addressService, CurrentUserService currentUserService) {
        this.addressService = addressService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    @Operation(summary = "Save a new address for the current user")
    public ResponseEntity<ApiResponse<AddressResponse>> create(
            @Valid @RequestBody CreateAddressRequest request,
            Authentication authentication) {
        var currentUser = currentUserService.resolve(authentication);
        AddressResponse response = addressService.create(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Address saved"));
    }

    @GetMapping("/me")
    @Operation(summary = "List the current user's saved addresses")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getMine(Authentication authentication) {
        var currentUser = currentUserService.resolve(authentication);
        return ResponseEntity.ok(ApiResponse.success(addressService.getMyAddresses(currentUser.getId())));
    }
}
