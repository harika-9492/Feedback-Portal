package com.fsad.feedbackbackend.repository;

import com.fsad.feedbackbackend.model.FeedbackFormEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackFormRepository extends JpaRepository<FeedbackFormEntity, Long> {
}
