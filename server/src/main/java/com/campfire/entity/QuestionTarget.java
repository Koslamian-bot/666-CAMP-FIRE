package com.campfire.entity;

import com.campfire.entity.enums.TargetType;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "question_targets")
public class QuestionTarget {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID questionId;

    private UUID targetPlayerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType = TargetType.SINGLE;

    public QuestionTarget() {}

    public QuestionTarget(UUID questionId, UUID targetPlayerId, TargetType targetType) {
        this.questionId = questionId;
        this.targetPlayerId = targetPlayerId;
        this.targetType = targetType;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }

    public UUID getTargetPlayerId() { return targetPlayerId; }
    public void setTargetPlayerId(UUID targetPlayerId) { this.targetPlayerId = targetPlayerId; }

    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }
}
