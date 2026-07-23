package com.ecosort.wasterequest.service;

import com.ecosort.wasterequest.dto.request.AssignCollectorRequest;
import com.ecosort.wasterequest.dto.request.CancelRequestRequest;
import com.ecosort.wasterequest.dto.request.CreateWasteRequestRequest;
import com.ecosort.wasterequest.dto.request.UpdateStatusRequest;
import com.ecosort.wasterequest.dto.response.RequestStatusHistoryResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestResponse;
import com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse;
import com.ecosort.wasterequest.entity.WasteRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface WasteRequestService {

    WasteRequestResponse create(Authentication caller, CreateWasteRequestRequest request);

    /** Role-scoped: throws ResourceNotFoundException (never 403) if the caller can't see this request. */
    WasteRequestResponse getById(Authentication caller, UUID requestId);

    List<RequestStatusHistoryResponse> getHistory(Authentication caller, UUID requestId);

    Page<WasteRequestSummaryResponse> getMyRequests(Authentication caller, WasteRequestStatus status, Pageable pageable);

    Page<WasteRequestSummaryResponse> getAssignedRequests(Authentication caller, WasteRequestStatus status, Pageable pageable);

    Page<WasteRequestSummaryResponse> getAllRequests(WasteRequestStatus status, Pageable pageable);

    WasteRequestResponse assignCollector(Authentication caller, UUID requestId, AssignCollectorRequest request);

    WasteRequestResponse updateStatus(Authentication caller, UUID requestId, UpdateStatusRequest request);

    WasteRequestResponse cancel(Authentication caller, UUID requestId, CancelRequestRequest request);
}
