package com.ecosort.wasteknowledge.repository;

import com.ecosort.wasteknowledge.entity.WasteItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface WasteItemRepository extends JpaRepository<WasteItem, UUID> {

    boolean existsByNameIgnoreCaseAndCategoryId(String name, UUID categoryId);

    boolean existsByNameIgnoreCaseAndCategoryIdAndIdNot(String name, UUID categoryId, UUID id);

    /**
     * JOIN FETCH loads the category eagerly in the same query, so
     * WasteItemResponse.from(item) can safely call item.getCategory()
     * without a LazyInitializationException (open-in-view is disabled).
     */
    @Query("SELECT i FROM WasteItem i JOIN FETCH i.category WHERE i.id = :id")
    Optional<WasteItem> findByIdWithCategory(@Param("id") UUID id);

    @Query(value = "SELECT i FROM WasteItem i JOIN FETCH i.category",
           countQuery = "SELECT count(i) FROM WasteItem i")
    Page<WasteItem> findAllWithCategory(Pageable pageable);

    @Query(value = "SELECT i FROM WasteItem i JOIN FETCH i.category c WHERE c.id = :categoryId",
           countQuery = "SELECT count(i) FROM WasteItem i WHERE i.category.id = :categoryId")
    Page<WasteItem> findByCategoryIdWithCategory(@Param("categoryId") UUID categoryId, Pageable pageable);

    /**
     * Case-insensitive substring match against name AND scientific name.
     * Backs GET /waste-items/search?keyword=. Uses LOWER(...) to align
     * with the functional index created in V2 (idx_waste_items_name).
     */
    @Query(value = """
            SELECT i FROM WasteItem i JOIN FETCH i.category
            WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(i.scientificName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """,
           countQuery = """
            SELECT count(i) FROM WasteItem i
            WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(i.scientificName) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<WasteItem> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    long countByCategoryId(UUID categoryId);
}
