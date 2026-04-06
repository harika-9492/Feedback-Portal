package com.fsad.feedbackbackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "feedback_forms")
public class FeedbackFormEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String course;
    private String subject;
    private String title;
    private String templateKey;
    private String description;
    private Boolean published;
    private Integer ratingScaleMax;
    private String createdBy;
    private Instant createdAt;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String assignedFacultyEmailsJson;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String questionsJson;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTemplateKey() {
        return templateKey;
    }

    public void setTemplateKey(String templateKey) {
        this.templateKey = templateKey;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getPublished() {
        return published;
    }

    public void setPublished(Boolean published) {
        this.published = published;
    }

    public Integer getRatingScaleMax() {
        return ratingScaleMax;
    }

    public void setRatingScaleMax(Integer ratingScaleMax) {
        this.ratingScaleMax = ratingScaleMax;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getAssignedFacultyEmailsJson() {
        return assignedFacultyEmailsJson;
    }

    public void setAssignedFacultyEmailsJson(String assignedFacultyEmailsJson) {
        this.assignedFacultyEmailsJson = assignedFacultyEmailsJson;
    }

    public String getQuestionsJson() {
        return questionsJson;
    }

    public void setQuestionsJson(String questionsJson) {
        this.questionsJson = questionsJson;
    }
}
