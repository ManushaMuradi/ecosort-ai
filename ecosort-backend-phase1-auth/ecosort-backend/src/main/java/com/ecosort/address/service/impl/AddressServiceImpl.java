package com.ecosort.address.service.impl;

import com.ecosort.address.dto.AddressResponse;
import com.ecosort.address.dto.CreateAddressRequest;
import com.ecosort.address.entity.Address;
import com.ecosort.address.repository.AddressRepository;
import com.ecosort.address.service.AddressService;
import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.security.entity.User;
import com.ecosort.security.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AddressResponse create(UUID userId, CreateAddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));

        Address address = new Address();
        address.setUser(user);
        address.setLine1(request.line1().trim());
        address.setLine2(request.line2());
        address.setCity(request.city().trim());
        address.setState(request.state());
        address.setPostalCode(request.postalCode().trim());
        address.setLatitude(request.latitude());
        address.setLongitude(request.longitude());

        return AddressResponse.from(addressRepository.save(address));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getMyAddresses(UUID userId) {
        return addressRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(AddressResponse::from)
                .collect(Collectors.toList());
    }
}
