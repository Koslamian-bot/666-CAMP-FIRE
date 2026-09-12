package com.campfire.entity;

import com.campfire.entity.enums.QuestionStatus;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID roomId;

    @Column(nullable = false)
    private UUID authorPlayerId;

    @Column(nullable = false, length = 1000)
    private String questionContent;

    @Column(nullable = false)
    private boolean isSensitive = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.SUBMITTED;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Question() {}

    public Question(UUID roomId, UUID authorPlayerId, String questionContent, boolean isSensitive) {
        this.roomId = roomId;
        this.authorPlayerId = authorPlayerId;
        this.questionContent = questionContent;
        this.isSensitive = isSensitive;
        this.status = QuestionStatus.SUBMITTED;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRoomId() { return roomId; }
    public void setRoomId(UUID roomId) { this.roomId = roomId; }

    public UUID getAuthorPlayerId() { return authorPlayerId; }
    public void setAuthorPlayerId(UUID authorPlayerId) { this.authorPlayerId = authorPlayerId; }

    public String getQuestionContent() { return questionContent; }
    public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }

    public boolean isSensitive() { return isSensitive; }
    public void setSensitive(boolean sensitive) { isSensitive = sensitive; }

    public QuestionStatus getStatus() { return status; }
    public void setStatus(QuestionStatus status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
