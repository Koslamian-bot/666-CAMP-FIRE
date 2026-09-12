package com.campfire.repository;

import com.campfire.entity.Guess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GuessRepository extends JpaRepository<Guess, UUID> {
    List<Guess> findByQuestionId(UUID questionId);
    Optional<Guess> findByQuestionIdAndGuessingPlayerId(UUID questionId, UUID guessingPlayerId);
}
