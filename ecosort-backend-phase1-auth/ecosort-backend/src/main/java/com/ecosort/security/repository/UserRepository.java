package com.ecosort.security.repository;

import com.ecosort.security.entity.RoleName;
import com.ecosort.security.entity.User;
import com.ecosort.security.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
        SELECT u
        FROM User u
        JOIN u.roles r
        WHERE r.name = :role
          AND u.status = :status
        ORDER BY u.fullName
    """)
    List<User> findByRoleAndStatus(
            @Param("role") RoleName role,
            @Param("status") UserStatus status
    );
}