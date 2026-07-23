package com.ecosort.security.service.impl;

import com.ecosort.security.dto.UserResponse;
import com.ecosort.security.entity.RoleName;
import com.ecosort.security.entity.UserStatus;
import com.ecosort.security.repository.UserRepository;
import com.ecosort.security.service.UserQueryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserQueryServiceImpl implements UserQueryService {

    private final UserRepository userRepository;

    public UserQueryServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listByRole(RoleName role) {
        // Always ACTIVE — a SUSPENDED collector shouldn't be assignable
        // to a new pickup request. Not a caller-supplied filter: this
        // is a fixed business rule, not an optional query parameter.
        return userRepository.findByRoleAndStatus(role, UserStatus.ACTIVE)
                .stream()
                .map(UserResponse::from)
                .toList();
    }
}
