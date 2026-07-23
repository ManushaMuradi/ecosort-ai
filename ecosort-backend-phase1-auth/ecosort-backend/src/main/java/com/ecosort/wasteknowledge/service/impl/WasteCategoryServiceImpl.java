package com.ecosort.wasteknowledge.service.impl;

import com.ecosort.common.exception.BusinessRuleException;
import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.wasteknowledge.dto.request.CreateCategoryRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateCategoryRequest;
import com.ecosort.wasteknowledge.dto.response.CategoryResponse;
import com.ecosort.wasteknowledge.entity.WasteCategory;
import com.ecosort.wasteknowledge.repository.WasteCategoryRepository;
import com.ecosort.wasteknowledge.repository.WasteItemRepository;
import com.ecosort.wasteknowledge.service.WasteCategoryService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

/**
 * Business logic for waste category management. Enforces duplicate-name
 * prevention and the "cannot delete a category still in use" rule,
 * independently of the database-level ON DELETE RESTRICT constraint
 * (defense in depth: this gives a clean 409 with a helpful message
 * instead of surfacing a raw SQL constraint violation to the client).
 */
@Service
public class WasteCategoryServiceImpl implements WasteCategoryService {

    private final WasteCategoryRepository categoryRepository;
    private final WasteItemRepository itemRepository;

    public WasteCategoryServiceImpl(WasteCategoryRepository categoryRepository,
                                     WasteItemRepository itemRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        String normalizedName = request.name().trim();

        if (categoryRepository.existsByName(normalizedName)) {
            throw new BusinessRuleException("A category named '" + normalizedName + "' already exists");
        }

        WasteCategory category = new WasteCategory(
                normalizedName,
                request.description(),
                request.binColor().trim(),
                request.recyclable()
        );

        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse update(UUID id, UpdateCategoryRequest request) {
        WasteCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteCategory", id));

        String normalizedName = request.name().trim();

        if (categoryRepository.existsByNameAndIdNot(normalizedName, id)) {
            throw new BusinessRuleException("A category named '" + normalizedName + "' already exists");
        }

        category.setName(normalizedName);
        category.setDescription(request.description());
        category.setBinColor(request.binColor().trim());
        category.setRecyclable(request.recyclable());

        return CategoryResponse.from(category); // managed entity — flushed on transaction commit
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        WasteCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteCategory", id));

        long itemCount = itemRepository.countByCategoryId(id);
        if (itemCount > 0) {
            throw new BusinessRuleException(
                    "Cannot delete category '" + category.getName() + "' — it still has "
                            + itemCount + " waste item(s) assigned to it");
        }

        categoryRepository.delete(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getById(UUID id) {
        WasteCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteCategory", id));
        return CategoryResponse.from(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getAll(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(CategoryResponse::from);
    }
}