package com.fsad.feedbackbackend.service;

import com.fsad.feedbackbackend.dto.AuthDtos.UserDto;
import com.fsad.feedbackbackend.dto.FacultyDtos.AddFacultyRequest;
import com.fsad.feedbackbackend.dto.FacultyDtos.OperationResponse;
import com.fsad.feedbackbackend.model.FeedbackFormEntity;
import com.fsad.feedbackbackend.model.UserEntity;
import com.fsad.feedbackbackend.repository.FeedbackFormRepository;
import com.fsad.feedbackbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FeedbackFormRepository formRepository;
    private final JsonService jsonService;

    public UserService(UserRepository userRepository, FeedbackFormRepository formRepository, JsonService jsonService) {
        this.userRepository = userRepository;
        this.formRepository = formRepository;
        this.jsonService = jsonService;
    }

    public List<UserDto> getFacultyUsers() {
        return userRepository.findByRole("faculty")
                .stream()
                .map(AuthService::toDto)
                .toList();
    }

    public OperationResponse addFaculty(AddFacultyRequest request) {
        if (request == null || isBlank(request.name()) || isBlank(request.email()) || isBlank(request.department())) {
            return new OperationResponse(false, "Faculty name, email and department are required.");
        }

        String email = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return new OperationResponse(false, "Faculty with this email already exists.");
        }

        UserEntity user = new UserEntity();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(isBlank(request.password()) ? "Faculty@123" : request.password());
        user.setRole("faculty");
        user.setRegisterNo("FAC" + (System.currentTimeMillis() % 1_000_000));
        user.setDepartment(request.department().trim());

        userRepository.save(user);
        return new OperationResponse(true, "Faculty account created.");
    }

    public void removeFaculty(String email) {
        if (email == null || email.isBlank()) {
            return;
        }

        String normalized = email.trim().toLowerCase();
        userRepository.deleteByEmail(normalized);

        List<FeedbackFormEntity> forms = formRepository.findAll();
        forms.forEach(form -> {
            List<String> assigned = jsonService.parseStringList(form.getAssignedFacultyEmailsJson())
                    .stream()
                    .filter(value -> !normalized.equalsIgnoreCase(value))
                    .toList();
            form.setAssignedFacultyEmailsJson(jsonService.toJson(assigned));
        });

        formRepository.saveAll(forms);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
