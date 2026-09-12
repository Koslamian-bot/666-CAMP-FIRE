package com.campfire.repository;

import com.campfire.entity.QuestionAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuestionAssignmentRepository extends JpaRepository<QuestionAssignment, UUID> {
    Optional<QuestionAssignment> findByQuestionId(UUID questionId);
    List<QuestionAssignment> findByAssignedPlayerId(UUID assignedPlayerId);
    void deleteByQuestionId(UUID questionId);
}
