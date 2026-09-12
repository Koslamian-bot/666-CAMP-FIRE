package com.campfire.repository;

import com.campfire.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface QuestionRepository extends JpaRepository<Question, UUID> {
    List<Question> findByRoomIdOrderByCreatedAtAsc(UUID roomId);
    List<Question> findByRoomIdAndAuthorPlayerId(UUID roomId, UUID authorPlayerId);
    long countByRoomId(UUID roomId);
}
