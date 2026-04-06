package com.fsad.feedbackbackend.controller;

import com.fsad.feedbackbackend.dto.AuthDtos.UserDto;
import com.fsad.feedbackbackend.dto.FacultyDtos.AddFacultyRequest;
import com.fsad.feedbackbackend.dto.FacultyDtos.OperationResponse;
import com.fsad.feedbackbackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/faculty")
    public List<UserDto> getFacultyUsers() {
        return userService.getFacultyUsers();
    }

    @PostMapping("/faculty")
    public ResponseEntity<OperationResponse> addFaculty(@RequestBody AddFacultyRequest request) {
        OperationResponse response = userService.addFaculty(request);
        if (!response.ok()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/faculty/{email}")
    public ResponseEntity<Void> removeFaculty(@PathVariable String email) {
        userService.removeFaculty(email);
        return ResponseEntity.noContent().build();
    }
}
