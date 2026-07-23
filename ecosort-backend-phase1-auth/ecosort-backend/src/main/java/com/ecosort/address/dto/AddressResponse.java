package com.ecosort.address.dto;

import com.ecosort.address.entity.Address;

import java.util.UUID;

public record AddressResponse(
        UUID id,
        String line1,
        String line2,
        String city,
        String state,
        String postalCode,
        Double latitude,
        Double longitude
) {
    public static AddressResponse from(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getLatitude(),
                address.getLongitude()
        );
    }
}
