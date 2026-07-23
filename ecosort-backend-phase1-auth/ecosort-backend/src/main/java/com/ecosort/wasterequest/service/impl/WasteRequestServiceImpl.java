package com.ecosort.wasterequest.service.impl;

import com.ecosort.address.entity.Address;
import com.ecosort.address.repository.AddressRepository;
import com.ecosort.common.exception.BusinessRuleException;
import com.ecosort.common.exception.ResourceNotFoundException;
import com.ecosort.security.entity.RoleName;
import com.ecosort.security.entity.User;
import com.ecosort.security.repository.UserRepository;
import com.ecosort.security.service.CurrentUserService;
import com.ecosort.wasteknowledge.entity.WasteItem;
import com.ecosort.wasteknowledge.repository.WasteItemRepository;
import com.ecosort.wasterequest.dto.request.*;
import com.ecosort.wasterequest.dto.response.RequestStatusHistoryResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse;
import com.ecosort.wasterequest.entity.RequestStatusHistory;
import com.ecosort.wasterequest.entity.WasteRequest;
import com.ecosort.wasterequest.entity.WasteRequestItem;
import com.ecosort.wasterequest.entity.WasteRequestStatus;
import com.ecosort.wasterequest.repository.RequestStatusHistoryRepository;
import com.ecosort.wasterequest.repository.WasteRequestRepository;
import com.ecosort.wasterequest.service.WasteRequestService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Business logic for the pickup request workflow. Every visibility
 * check, transition rule, and cross-entity validation lives here —
 * WasteRequestController stays a thin HTTP adapter, mirroring every
 * other service in the codebase.
 */
@Service
public class WasteRequestServiceImpl implements WasteRequestService {

    private final WasteRequestRepository wasteRequestRepository;
    private final RequestStatusHistoryRepository historyRepository;
    private final AddressRepository addressRepository;
    private final WasteItemRepository wasteItemRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public WasteRequestServiceImpl(WasteRequestRepository wasteRequestRepository,
                                    RequestStatusHistoryRepository historyRepository,
                                    AddressRepository addressRepository,
                                    WasteItemRepository wasteItemRepository,
                                    UserRepository userRepository,
                                    CurrentUserService currentUserService) {
        this.wasteRequestRepository = wasteRequestRepository;
        this.historyRepository = historyRepository;
        this.addressRepository = addressRepository;
        this.wasteItemRepository = wasteItemRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Override
    @Transactional
    public WasteRequestResponse create(Authentication caller, CreateWasteRequestRequest request) {
        User citizen = currentUserService.resolve(caller);

        // Ownership check on the address — 404, not 403: a citizen
        // referencing someone else's address id should see "not found",
        // not confirmation that the id belongs to another account.
        Address address = addressRepository.findById(request.addressId())
                .filter(a -> a.getUser().getId().equals(citizen.getId()))
                .orElseThrow(() -> ResourceNotFoundException.of("Address", request.addressId()));

        // Bean Validation already guarantees a non-empty list; this
        // guards the business rule Postgres itself cannot express (no
        // cross-table CHECK constraint) — see V3's migration comment.
        Set<UUID> seenItemIds = new LinkedHashSet<>();
        for (WasteRequestItemInput itemInput : request.items()) {
            if (!seenItemIds.add(itemInput.wasteItemId())) {
                throw new BusinessRuleException(
                        "Duplicate waste item in request: each item may only appear once per pickup request");
            }
        }

        WasteRequest wasteRequest = new WasteRequest();
        wasteRequest.setCitizen(citizen);
        wasteRequest.setAddress(address);
        wasteRequest.setContactPhone(request.contactPhone().trim());
        wasteRequest.setPreferredPickupDate(request.preferredPickupDate());
        wasteRequest.setPickupNotes(request.pickupNotes());
        wasteRequest.setStatus(WasteRequestStatus.REQUESTED);

        for (WasteRequestItemInput itemInput : request.items()) {
            WasteItem wasteItem = wasteItemRepository.findById(itemInput.wasteItemId())
                    .orElseThrow(() -> ResourceNotFoundException.of("WasteItem", itemInput.wasteItemId()));
            wasteRequest.addItem(new WasteRequestItem(wasteItem, itemInput.quantity(), itemInput.estimatedWeightKg()));
        }

        WasteRequest saved = wasteRequestRepository.save(wasteRequest);
        historyRepository.save(new RequestStatusHistory(saved, null, WasteRequestStatus.REQUESTED, citizen, "Request created"));

        return WasteRequestResponse.from(reload(saved.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public WasteRequestResponse getById(Authentication caller, UUID requestId) {
        User user = currentUserService.resolve(caller);
        WasteRequest request = reload(requestId);
        requireVisible(user, request);
        return WasteRequestResponse.from(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RequestStatusHistoryResponse> getHistory(Authentication caller, UUID requestId) {
        User user = currentUserService.resolve(caller);
        WasteRequest request = reload(requestId);
        requireVisible(user, request);
        return historyRepository.findByWasteRequestIdOrderByChangedAtAsc(requestId).stream()
                .map(RequestStatusHistoryResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteRequestSummaryResponse> getMyRequests(Authentication caller, WasteRequestStatus status, Pageable pageable) {
        User citizen = currentUserService.resolve(caller);
        return wasteRequestRepository.findByCitizenId(citizen.getId(), status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteRequestSummaryResponse> getAssignedRequests(Authentication caller, WasteRequestStatus status, Pageable pageable) {
        User collector = currentUserService.resolve(caller);
        return wasteRequestRepository.findByCollectorId(collector.getId(), status, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<WasteRequestSummaryResponse> getAllRequests(
        WasteRequestStatus status,
        Pageable pageable) {

    Page<WasteRequestSummaryResponse> page =
            wasteRequestRepository.findAllForAdmin(status, pageable);

    System.out.println("Requests found: " + page.getTotalElements());

    return page;
    }

    @Override
    @Transactional
    public WasteRequestResponse assignCollector(Authentication caller, UUID requestId, AssignCollectorRequest request) {
        User admin = currentUserService.resolve(caller);
        WasteRequest wasteRequest = reload(requestId);

        if (wasteRequest.getStatus() != WasteRequestStatus.REQUESTED) {
            throw new BusinessRuleException(
                    "Cannot assign a collector: request is " + wasteRequest.getStatus()
                            + ", not REQUESTED");
        }

        User collector = userRepository.findById(request.collectorId())
                .orElseThrow(() -> ResourceNotFoundException.of("User", request.collectorId()));

        boolean isCollector = collector.getRoles().stream()
                .anyMatch(role -> role.getName() == RoleName.COLLECTOR);
        if (!isCollector) {
            throw new BusinessRuleException("Selected user does not hold the COLLECTOR role");
        }

        transition(wasteRequest, WasteRequestStatus.SCHEDULED, admin,
                "Assigned to " + collector.getFullName());
        wasteRequest.setCollector(collector);

        return WasteRequestResponse.from(reload(wasteRequest.getId()));
    }

    @Override
    @Transactional
    public WasteRequestResponse updateStatus(Authentication caller, UUID requestId, UpdateStatusRequest request) {
        User user = currentUserService.resolve(caller);
        WasteRequest wasteRequest = reload(requestId);

        boolean isAdmin = hasAnyRole(user, RoleName.MUNICIPAL_ADMIN, RoleName.SUPER_ADMIN);
        boolean isAssignedCollector = wasteRequest.getCollector() != null
                && wasteRequest.getCollector().getId().equals(user.getId());

        // A collector may only progress a request assigned to THEM —
        // admins may override any request. @PreAuthorize on the
        // controller already restricts this endpoint to
        // COLLECTOR/MUNICIPAL_ADMIN/SUPER_ADMIN; this is the
        // finer-grained "which specific request" check that role alone
        // can't express.
        if (!isAdmin && !isAssignedCollector) {
            throw ResourceNotFoundException.of("WasteRequest", requestId);
        }

        // SCHEDULED and CANCELLED are deliberately unreachable through
        // this generic endpoint — SCHEDULED must go through
        // assignCollector() (which sets a collector and transitions
        // atomically, satisfying the DB's chk_waste_request_collector_required
        // constraint), and CANCELLED must go through the citizen-only
        // cancel() endpoint. Rejecting here with a clear 409 is more
        // helpful than letting the DB CHECK constraint be the only
        // thing that catches a missing collector.
        if (request.status() == WasteRequestStatus.SCHEDULED || request.status() == WasteRequestStatus.CANCELLED) {
            throw new BusinessRuleException(
                    "Use the dedicated assign or cancel endpoint to reach " + request.status());
        }

        transition(wasteRequest, request.status(), user, request.remarks());
        return WasteRequestResponse.from(reload(wasteRequest.getId()));
    }

    @Override
    @Transactional
    public WasteRequestResponse cancel(Authentication caller, UUID requestId, CancelRequestRequest request) {
        User citizen = currentUserService.resolve(caller);
        WasteRequest wasteRequest = reload(requestId);

        if (!wasteRequest.getCitizen().getId().equals(citizen.getId())) {
            throw ResourceNotFoundException.of("WasteRequest", requestId);
        }

        if (wasteRequest.getStatus() != WasteRequestStatus.REQUESTED) {
            throw new BusinessRuleException(
                    "Only a request still in REQUESTED status can be cancelled");
        }

        transition(wasteRequest, WasteRequestStatus.CANCELLED, citizen, request.remarks());
        return WasteRequestResponse.from(reload(wasteRequest.getId()));
    }

    // ── internal helpers ────────────────────────────────────────────

    /** Re-fetches with the full JOIN FETCH graph — used after every mutation so the returned DTO is complete. */
    private WasteRequest reload(UUID id) {
        return wasteRequestRepository.findByIdWithDetails(id)
                .orElseThrow(() -> ResourceNotFoundException.of("WasteRequest", id));
    }

    private void requireVisible(User user, WasteRequest request) {
        boolean isAdmin = hasAnyRole(user, RoleName.MUNICIPAL_ADMIN, RoleName.SUPER_ADMIN);
        boolean isOwner = request.getCitizen().getId().equals(user.getId());
        boolean isAssignedCollector = request.getCollector() != null
                && request.getCollector().getId().equals(user.getId());

        if (!isAdmin && !isOwner && !isAssignedCollector) {
            // 404, not 403 — existence of another citizen's request is
            // not confirmed to an unauthorized caller.
            throw ResourceNotFoundException.of("WasteRequest", request.getId());
        }
    }

    private boolean hasAnyRole(User user, RoleName... roleNames) {
        Set<RoleName> target = Set.of(roleNames);
        return user.getRoles().stream().anyMatch(role -> target.contains(role.getName()));
    }

    /**
     * Validates the transition against WasteRequestStatus's own legal-
     * transition map, applies it, and writes the audit-trail row — the
     * one place every status change in the whole feature passes through.
     */
    private void transition(WasteRequest wasteRequest, WasteRequestStatus target, User actor, String remarks) {
        WasteRequestStatus current = wasteRequest.getStatus();
        if (!current.canTransitionTo(target)) {
            throw new BusinessRuleException(
                    "Cannot transition from " + current + " to " + target);
        }
        wasteRequest.setStatus(target);
        historyRepository.save(new RequestStatusHistory(wasteRequest, current, target, actor, remarks));
    }
}
