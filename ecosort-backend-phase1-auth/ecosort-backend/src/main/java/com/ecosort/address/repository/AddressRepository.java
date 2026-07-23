package com.ecosort.address.repository;

import com.ecosort.address.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {

    List<Address> findByUserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByIdAndUserId(UUID id, UUID userId);
}
