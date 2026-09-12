package com.campfire.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "guesses")
public class Guess {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID questionId;

    @Column(nullable = false)
    private UUID guessingPlayerId;

    private UUID guessedAuthorId;

    private UUID guessedTargetId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Guess() {}

    public Guess(UUID questionId, UUID guessingPlayerId, UUID guessedAuthorId, UUID guessedTargetId) {
        this.questionId = questionId;
        this.guessingPlayerId = guessingPlayerId;
        this.guessedAuthorId = guessedAuthorId;
        this.guessedTargetId = guessedTargetId;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }

    public UUID getGuessingPlayerId() { return guessingPlayerId; }
    public void setGuessingPlayerId(UUID guessingPlayerId) { this.guessingPlayerId = guessingPlayerId; }

    public UUID getGuessedAuthorId() { return guessedAuthorId; }
    public void setGuessedAuthorId(UUID guessedAuthorId) { this.guessedAuthorId = guessedAuthorId; }

    public UUID getGuessedTargetId() { return guessedTargetId; }
    public void setGuessedTargetId(UUID guessedTargetId) { this.guessedTargetId = guessedTargetId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
