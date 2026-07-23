package com.ecosort.wasteknowledge.service.impl;

import com.ecosort.common.exception.BusinessRuleException;
import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.wasteknowledge.dto.request.CreateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.request.UpdateWasteItemRequest;
import com.ecosort.wasteknowledge.dto.response.WasteItemResponse;
import com.ecosort.wasteknowledge.entity.WasteCategory;
import com.ecosort.wasteknowledge.entity.WasteItem;
import com.ecosort.wasteknowledge.repository.WasteCategoryRepository;
import com.ecosort.wasteknowledge.repository.WasteItemRepository;
import com.ecosort.wasteknowledge.service.WasteItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

/**
 * Business logic for waste item management and lookup. Enforces
 * per-category duplicate-name prevention and validates that a
 * referenced category actually exists before an item can be attached
 * to it — independent of the database FK constraint (defense in depth:
 * a clean 404/409 with a helpful message instead of a raw SQL error).
 */
@Service
public class WasteItemServiceImpl implements WasteItemService {

    private final WasteItemRepository itemRepository;
    private final WasteCategoryRepository categoryRepository;

    public WasteItemServiceImpl(WasteItemRepository itemRepository,
                                 WasteCategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public WasteItemResponse create(CreateWasteItemRequest request) {
        WasteCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> ResourceNotFoundException.of("WasteCategory", request.categoryId()));

        String normalizedName = request.name().trim();

        if (itemRepository.existsByNameIgnoreCaseAndCategoryId(normalizedName, category.getId())) {
            throw new BusinessRuleException(
                    "A waste item named '" + normalizedName + "' already exists in category '"
                            + category.getName() + "'");
        }

        WasteItem item = new WasteItem();
        item.setName(normalizedName);
        item.setScientificName(normalizeOrNull(request.scientificName()));
        item.setCategory(category);
        item.setDisposalMethod(request.disposalMethod().trim());
        item.setRecyclingInstructions(normalizeOrNull(request.recyclingInstructions()));
        item.setHazardous(request.hazardous());
        item.setImageUrl(normalizeOrNull(request.imageUrl()));

        WasteItem saved = itemRepository.save(item);
        return WasteItemResponse.from(saved);
    }

    @Override
    @Transactional
    public WasteItemResponse update(UUID id, UpdateWasteItemRequest request) {
        WasteItem item = itemRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteItem", id));

        WasteCategory category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> ResourceNotFoundException.of("WasteCategory", request.categoryId()));

        String normalizedName = request.name().trim();

        if (itemRepository.existsByNameIgnoreCaseAndCategoryIdAndIdNot(normalizedName, category.getId(), id)) {
            throw new BusinessRuleException(
                    "A waste item named '" + normalizedName + "' already exists in category '"
                            + category.getName() + "'");
        }

        item.setName(normalizedName);
        item.setScientificName(normalizeOrNull(request.scientificName()));
        item.setCategory(category);
        item.setDisposalMethod(request.disposalMethod().trim());
        item.setRecyclingInstructions(normalizeOrNull(request.recyclingInstructions()));
        item.setHazardous(request.hazardous());
        item.setImageUrl(normalizeOrNull(request.imageUrl()));

        // Managed entity within an open transaction — category is already
        // a fully-initialized (non-proxy) instance we just fetched above,
        // so mapping to WasteItemResponse below is safe without a
        // separate JOIN FETCH reload.
        return WasteItemResponse.from(item);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        if (!itemRepository.existsById(id)) {
            throw ResourceNotFoundException.of("WasteItem", id);
        }
        itemRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public WasteItemResponse getById(UUID id) {
        WasteItem item = itemRepository.findByIdWithCategory(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteItem", id));
        return WasteItemResponse.from(item);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteItemResponse> getAll(Pageable pageable) {
        return itemRepository.findAllWithCategory(pageable).map(WasteItemResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteItemResponse> getByCategory(UUID categoryId, Pageable pageable) {
        if (!categoryRepository.existsById(categoryId)) {
            throw ResourceNotFoundException.of("WasteCategory", categoryId);
        }
        return itemRepository.findByCategoryIdWithCategory(categoryId, pageable).map(WasteItemResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteItemResponse> search(String keyword, Pageable pageable) {
        if (!StringUtils.hasText(keyword)) {
            throw new BusinessRuleException("Search keyword must not be blank");
        }
        return itemRepository.searchByKeyword(keyword.trim(), pageable).map(WasteItemResponse::from);
    }

    /** Collapses blank/whitespace-only optional text fields to null instead of storing "". */
    private String normalizeOrNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
