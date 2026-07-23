package com.ecosort.wasteknowledge.repository;

import com.ecosort.wasteknowledge.entity.WasteCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WasteCategoryRepository extends JpaRepository<WasteCategory, UUID> {

    Optional<WasteCategory> findByName(String name);

    boolean existsByName(String name);

    /**
     * True if a DIFFERENT category already owns this name — used during
     * update to allow a category to keep its own name unchanged while
     * still rejecting a rename that collides with another category.
     */
    boolean existsByNameAndIdNot(String name, UUID id);
}