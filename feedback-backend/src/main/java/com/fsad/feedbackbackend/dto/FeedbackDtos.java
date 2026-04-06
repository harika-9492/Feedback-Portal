package com.fsad.feedbackbackend.dto;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public class FeedbackDtos {

    public record QuestionDto(String question, String type, List<String> options) {}

    public record FormRequest(
            String course,
            String subject,
            String title,
            String templateKey,
            String description,
            Boolean published,
            Integer ratingScaleMax,
            String createdBy,
            List<String> assignedFacultyEmails,
            List<QuestionDto> questions
    ) {}

    public record FormDto(
            Long id,
            String course,
            String subject,
            String title,
            String templateKey,
            String description,
            Boolean published,
            Integer ratingScaleMax,
            String createdBy,
            Instant createdAt,
            List<String> assignedFacultyEmails,
            List<QuestionDto> questions
    ) {}

    public record ResponseRequest(Long formId, String submittedBy, String date, Map<String, Object> answers) {}

    public record ResponseDto(Long id, Long formId, String submittedBy, Instant submittedAt, String date, Map<String, Object> answers) {}

    public record DistributionDto(String rating, long count) {}

    public record QuestionAverageDto(String question, String type, Double average) {}

    public record AnalyticsDto(
            Long formId,
            Integer ratingScaleMax,
            long totalSubmissions,
            List<QuestionAverageDto> averagePerQuestion,
            Double overallRating,
            List<DistributionDto> distribution,
            Instant lastUpdated
    ) {}
}
