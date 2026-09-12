package com.campfire.entity;

import com.campfire.entity.enums.AnswerDecision;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "question_assignments")
public class QuestionAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID questionId;

    @Column(nullable = false)
    private UUID assignedPlayerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnswerDecision answerDecision = AnswerDecision.PENDING;

    @Column(length = 2000)
    private String initialAnswer;

    private Instant answeredAt;

    @Column(nullable = false)
    private boolean discussionCompleted = false;

    @Column(length = 2000)
    private String actualTargetResponse;

    @Column(length = 2000)
    private String authorContext;

    public QuestionAssignment() {}

    public QuestionAssignment(UUID questionId, UUID assignedPlayerId) {
        this.questionId = questionId;
        this.assignedPlayerId = assignedPlayerId;
        this.answerDecision = AnswerDecision.PENDING;
        this.discussionCompleted = false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }

    public UUID getAssignedPlayerId() { return assignedPlayerId; }
    public void setAssignedPlayerId(UUID assignedPlayerId) { this.assignedPlayerId = assignedPlayerId; }

    public AnswerDecision getAnswerDecision() { return answerDecision; }
    public void setAnswerDecision(AnswerDecision answerDecision) { this.answerDecision = answerDecision; }

    public String getInitialAnswer() { return initialAnswer; }
    public void setInitialAnswer(String initialAnswer) { this.initialAnswer = initialAnswer; }

    public Instant getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(Instant answeredAt) { this.answeredAt = answeredAt; }

    public boolean isDiscussionCompleted() { return discussionCompleted; }
    public void setDiscussionCompleted(boolean discussionCompleted) { this.discussionCompleted = discussionCompleted; }

    public String getActualTargetResponse() { return actualTargetResponse; }
    public void setActualTargetResponse(String actualTargetResponse) { this.actualTargetResponse = actualTargetResponse; }

    public String getAuthorContext() { return authorContext; }
    public void setAuthorContext(String authorContext) { this.authorContext = authorContext; }
}
