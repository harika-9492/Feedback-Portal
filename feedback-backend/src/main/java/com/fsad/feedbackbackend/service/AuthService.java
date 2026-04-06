package com.fsad.feedbackbackend.service;

import com.fsad.feedbackbackend.dto.AuthDtos.AuthResponse;
import com.fsad.feedbackbackend.dto.AuthDtos.LoginRequest;
import com.fsad.feedbackbackend.dto.AuthDtos.RegisterRequest;
import com.fsad.feedbackbackend.dto.AuthDtos.UserDto;
import com.fsad.feedbackbackend.model.UserEntity;
import com.fsad.feedbackbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest request) {
        if (request == null || request.email() == null || request.password() == null) {
            return new AuthResponse(false, "Email and password are required", null);
        }

        return userRepository.findByEmail(request.email().trim().toLowerCase())
                .filter(user -> user.getPassword().equals(request.password()))
                .map(user -> new AuthResponse(true, "Login successful", toDto(user)))
                .orElseGet(() -> new AuthResponse(false, "Invalid credentials", null));
    }

    public AuthResponse registerStudent(RegisterRequest request) {
        if (request == null || isBlank(request.name()) || isBlank(request.email()) || isBlank(request.registerNo()) || isBlank(request.password())) {
            return new AuthResponse(false, "All required fields must be provided", null);
        }

        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse(false, "User already exists with this email", null);
        }

        if (userRepository.existsByRegisterNo(request.registerNo().trim())) {
            return new AuthResponse(false, "User already exists with this register number", null);
        }

        UserEntity user = new UserEntity();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setRegisterNo(request.registerNo().trim());
        user.setPassword(request.password());
        user.setRole("student");
        user.setDepartment(request.department() == null ? "" : request.department().trim());

        UserEntity saved = userRepository.save(user);
        return new AuthResponse(true, "Registered successfully", toDto(saved));
    }

    public static UserDto toDto(UserEntity user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getRegisterNo(),
                user.getDepartment()
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
