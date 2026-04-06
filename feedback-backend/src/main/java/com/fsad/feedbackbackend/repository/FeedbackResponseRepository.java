package com.fsad.feedbackbackend.repository;

import com.fsad.feedbackbackend.model.FeedbackResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackResponseRepository extends JpaRepository<FeedbackResponseEntity, Long> {
    List<FeedbackResponseEntity> findByFormId(Long formId);
    boolean existsByFormIdAndSubmittedBy(Long formId, String submittedBy);
}
