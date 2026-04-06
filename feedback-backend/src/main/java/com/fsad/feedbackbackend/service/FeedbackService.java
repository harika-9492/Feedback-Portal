package com.fsad.feedbackbackend.service;

import com.fsad.feedbackbackend.dto.FeedbackDtos.AnalyticsDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.DistributionDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.FormDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.FormRequest;
import com.fsad.feedbackbackend.dto.FeedbackDtos.QuestionAverageDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.QuestionDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.ResponseDto;
import com.fsad.feedbackbackend.dto.FeedbackDtos.ResponseRequest;
import com.fsad.feedbackbackend.model.FeedbackFormEntity;
import com.fsad.feedbackbackend.model.FeedbackResponseEntity;
import com.fsad.feedbackbackend.repository.FeedbackFormRepository;
import com.fsad.feedbackbackend.repository.FeedbackResponseRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FeedbackService {

    private final FeedbackFormRepository formRepository;
    private final FeedbackResponseRepository responseRepository;
    private final JsonService jsonService;

    public FeedbackService(FeedbackFormRepository formRepository, FeedbackResponseRepository responseRepository, JsonService jsonService) {
        this.formRepository = formRepository;
        this.responseRepository = responseRepository;
        this.jsonService = jsonService;
    }

    public FormDto createForm(FormRequest request) {
        FeedbackFormEntity entity = new FeedbackFormEntity();
        entity.setCourse(request.course());
        entity.setSubject(request.subject());
        entity.setTitle(request.title());
        entity.setTemplateKey(request.templateKey());
        entity.setDescription(request.description());
        entity.setPublished(request.published() == null || request.published());
        entity.setRatingScaleMax(request.ratingScaleMax() == null ? 5 : request.ratingScaleMax());
        entity.setCreatedBy(request.createdBy());
        entity.setCreatedAt(Instant.now());
        entity.setAssignedFacultyEmailsJson(jsonService.toJson(request.assignedFacultyEmails() == null ? List.of() : request.assignedFacultyEmails()));
        entity.setQuestionsJson(jsonService.toJson(request.questions() == null ? List.of() : request.questions()));

        return toFormDto(formRepository.save(entity));
    }

    public List<FormDto> getAllForms() {
        return formRepository.findAll().stream().map(this::toFormDto).toList();
    }

    public List<FormDto> getStudentForms() {
        return formRepository.findAll().stream()
                .filter(form -> Boolean.TRUE.equals(form.getPublished()))
                .map(this::toFormDto)
                .toList();
    }

    public List<FormDto> getFacultyForms(String facultyEmail) {
        if (facultyEmail == null || facultyEmail.isBlank()) {
            return List.of();
        }

        String normalized = facultyEmail.trim().toLowerCase();
        return formRepository.findAll().stream()
                .filter(form -> jsonService.parseStringList(form.getAssignedFacultyEmailsJson())
                        .stream()
                        .anyMatch(value -> normalized.equalsIgnoreCase(value)))
                .map(this::toFormDto)
                .toList();
    }

    public ResponseDto submitResponse(ResponseRequest request) {
        FeedbackResponseEntity entity = new FeedbackResponseEntity();
        entity.setFormId(request.formId());
        entity.setSubmittedBy(request.submittedBy());
        entity.setDate(request.date());
        entity.setSubmittedAt(Instant.now());
        entity.setAnswersJson(jsonService.toJson(request.answers() == null ? Map.of() : request.answers()));
        return toResponseDto(responseRepository.save(entity));
    }

    public List<ResponseDto> getResponses() {
        return responseRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public boolean hasSubmitted(Long formId, String studentEmail) {
        if (formId == null || studentEmail == null || studentEmail.isBlank()) {
            return false;
        }
        return responseRepository.existsByFormIdAndSubmittedBy(formId, studentEmail.trim().toLowerCase());
    }

    public Map<Long, AnalyticsDto> getAnalyticsByForm() {
        Map<Long, AnalyticsDto> analytics = new HashMap<>();
        List<FormDto> forms = getAllForms();
        List<ResponseDto> responses = getResponses();

        for (FormDto form : forms) {
            List<ResponseDto> formResponses = responses.stream()
                    .filter(response -> form.id().equals(response.formId()))
                    .toList();
            analytics.put(form.id(), computeAnalytics(form, formResponses));
        }

        return analytics;
    }

    public AnalyticsDto getAnalyticsForForm(Long formId) {
        FormDto form = getAllForms().stream().filter(item -> item.id().equals(formId)).findFirst().orElse(null);
        if (form == null) {
            return null;
        }
        List<ResponseDto> responses = getResponses().stream().filter(item -> item.formId().equals(formId)).toList();
        return computeAnalytics(form, responses);
    }

    private FormDto toFormDto(FeedbackFormEntity entity) {
        List<QuestionDto> questions = jsonService.parseObjectList(entity.getQuestionsJson()).stream()
                .map(item -> new QuestionDto(
                        (String) item.getOrDefault("question", ""),
                        (String) item.getOrDefault("type", "text"),
                        toStringList(item.get("options"))
                ))
                .toList();

        return new FormDto(
                entity.getId(),
                entity.getCourse(),
                entity.getSubject(),
                entity.getTitle(),
                entity.getTemplateKey(),
                entity.getDescription(),
                entity.getPublished(),
                entity.getRatingScaleMax(),
                entity.getCreatedBy(),
                entity.getCreatedAt(),
                jsonService.parseStringList(entity.getAssignedFacultyEmailsJson()),
                questions
        );
    }

    private ResponseDto toResponseDto(FeedbackResponseEntity entity) {
        return new ResponseDto(
                entity.getId(),
                entity.getFormId(),
                entity.getSubmittedBy(),
                entity.getSubmittedAt(),
                entity.getDate(),
                jsonService.parseObjectMap(entity.getAnswersJson())
        );
    }

    private AnalyticsDto computeAnalytics(FormDto form, List<ResponseDto> responses) {
        int scaleMax = form.ratingScaleMax() == null ? 5 : form.ratingScaleMax();
        long totalSubmissions = responses.size();

        List<QuestionAverageDto> averages = new ArrayList<>();
        for (int i = 0; i < form.questions().size(); i++) {
            QuestionDto question = form.questions().get(i);
            if (!"rating".equals(question.type())) {
                averages.add(new QuestionAverageDto(question.question(), question.type(), null));
                continue;
            }

            List<Double> values = new ArrayList<>();
            for (ResponseDto response : responses) {
                Object answerValue = response.answers().get(String.valueOf(i));
                if (answerValue instanceof Number number && number.doubleValue() > 0) {
                    values.add(number.doubleValue());
                }
            }

            double avg = values.isEmpty() ? 0.0 : values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
            averages.add(new QuestionAverageDto(question.question(), question.type(), round2(avg)));
        }

        List<Double> ratingAverages = averages.stream()
                .filter(item -> "rating".equals(item.type()) && item.average() != null)
                .map(QuestionAverageDto::average)
                .toList();

        double overall = ratingAverages.isEmpty() ? 0.0 : round2(ratingAverages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0));

        List<DistributionDto> distribution = new ArrayList<>();
        for (int ratingPoint = 1; ratingPoint <= scaleMax; ratingPoint++) {
            long count = 0;
            for (ResponseDto response : responses) {
                for (int i = 0; i < form.questions().size(); i++) {
                    QuestionDto question = form.questions().get(i);
                    if (!"rating".equals(question.type())) {
                        continue;
                    }
                    Object answerValue = response.answers().get(String.valueOf(i));
                    if (answerValue instanceof Number number && number.intValue() == ratingPoint) {
                        count++;
                    }
                }
            }
            distribution.add(new DistributionDto(ratingPoint + " Star", count));
        }

        return new AnalyticsDto(
                form.id(),
                scaleMax,
                totalSubmissions,
                averages,
                overall,
                distribution,
                Instant.now()
        );
    }

    private List<String> toStringList(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(String::valueOf).toList();
        }
        return List.of();
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
