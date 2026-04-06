package com.fsad.feedbackbackend.repository;

import com.fsad.feedbackbackend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
    List<UserEntity> findByRole(String role);
    boolean existsByEmail(String email);
    boolean existsByRegisterNo(String registerNo);
    void deleteByEmail(String email);
}
