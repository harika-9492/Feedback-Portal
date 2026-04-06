package com.fsad.feedbackbackend.dto;

public class FacultyDtos {

    public record AddFacultyRequest(String name, String email, String password, String department) {}

    public record OperationResponse(boolean ok, String message) {}
}
