package com.campfire.repository;

import com.campfire.entity.QuestionTarget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionTargetRepository extends JpaRepository<QuestionTarget, UUID> {
    List<QuestionTarget> findByQuestionId(UUID questionId);
    void deleteByQuestionId(UUID questionId);
}
