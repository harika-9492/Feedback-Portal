package com.fsad.feedbackbackend.dto;

public class AuthDtos {

    public record LoginRequest(String email, String password) {}

    public record RegisterRequest(String name, String email, String registerNo, String password, String department) {}

    public record UserDto(Long id, String name, String email, String role, String registerNo, String department) {}

    public record AuthResponse(boolean ok, String message, UserDto user) {}
}
