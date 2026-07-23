package com.ecosort.security.service;

import com.ecosort.security.dto.UserResponse;
import com.ecosort.security.entity.RoleName;

import java.util.List;

/**
 * User lookup/query capability, deliberately kept separate from
 * AuthService (which owns registration/login/refresh/logout — actions,
 * not queries) and from CustomUserDetailsService (which owns the
 * Spring Security UserDetails adaptation, an internal framework
 * concern). Interface Segregation: a class that only needs to look up
 * users by role shouldn't depend on an interface that also knows how
 * to log someone in.
 */
public interface UserQueryService {

    /** Active users holding the given role, ordered by full name. */
    List<UserResponse> listByRole(RoleName role);
}
