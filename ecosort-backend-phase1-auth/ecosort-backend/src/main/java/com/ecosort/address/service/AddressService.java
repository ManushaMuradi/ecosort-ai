package com.ecosort.address.service;

import com.ecosort.address.dto.AddressResponse;
import com.ecosort.address.dto.CreateAddressRequest;

import java.util.List;
import java.util.UUID;

public interface AddressService {

    AddressResponse create(UUID userId, CreateAddressRequest request);

    List<AddressResponse> getMyAddresses(UUID userId);
}
