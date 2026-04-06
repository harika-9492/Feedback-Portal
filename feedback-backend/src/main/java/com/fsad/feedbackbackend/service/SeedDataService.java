package com.fsad.feedbackbackend.service;

import com.fsad.feedbackbackend.model.UserEntity;
import com.fsad.feedbackbackend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataService {

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository) {
        return args -> {
            createIfMissing(userRepository, "System Admin", "admin@college.edu", "Admin@123", "admin", "ADM001", "Administration");
            createIfMissing(userRepository, "Faculty One", "faculty1@college.edu", "Faculty@123", "faculty", "FAC001", "Computer Science");
            createIfMissing(userRepository, "Faculty Two", "faculty2@college.edu", "Faculty@123", "faculty", "FAC002", "Electronics");
            createIfMissing(userRepository, "Student Demo", "student1@college.edu", "Student@123", "student", "STU001", "Computer Science");
        };
    }

    private void createIfMissing(
            UserRepository userRepository,
            String name,
            String email,
            String password,
            String role,
            String registerNo,
            String department
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        UserEntity user = new UserEntity();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setRegisterNo(registerNo);
        user.setDepartment(department);

        userRepository.save(user);
    }
}
