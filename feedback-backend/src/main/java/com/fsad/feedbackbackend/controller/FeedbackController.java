package com.fsad.feedbackbackend.controller;

import com.fsad.feedbackbackend.dto.FeedbackDtos.AnalyticsDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.FormDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.FormRequest;
import com.fsad.feedbackbackend.dto.FeedbackDtos.ResponseDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.ResponseRequest;
import com.fsad.feedbackbackend.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/forms")
    public FormDto createForm(@RequestBody FormRequest request) {
        return feedbackService.createForm(request);
    }

    @GetMapping("/forms")
    public List<FormDto> getForms() {
        return feedbackService.getAllForms();
    }

    @GetMapping("/forms/student")
    public List<FormDto> getStudentForms() {
        return feedbackService.getStudentForms();
    }

    @GetMapping("/forms/faculty/{email}")
    public List<FormDto> getFacultyForms(@PathVariable String email) {
        return feedbackService.getFacultyForms(email);
    }

    @PostMapping("/responses")
    public ResponseDto submitResponse(@RequestBody ResponseRequest request) {
        return feedbackService.submitResponse(request);
    }

    @GetMapping("/responses")
    public List<ResponseDto> getResponses() {
        return feedbackService.getResponses();
    }

    @GetMapping("/responses/check")
    public Map<String, Boolean> hasSubmitted(@RequestParam Long formId, @RequestParam String studentEmail) {
        return Map.of("submitted", feedbackService.hasSubmitted(formId, studentEmail));
    }

    @GetMapping("/analytics")
    public Map<Long, AnalyticsDto> getAnalytics() {
        return feedbackService.getAnalyticsByForm();
    }

    @GetMapping("/analytics/{formId}")
    public ResponseEntity<AnalyticsDto> getAnalyticsForForm(@PathVariable Long formId) {
        AnalyticsDto analytics = feedbackService.getAnalyticsForForm(formId);
        if (analytics == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(analytics);
    }
}
