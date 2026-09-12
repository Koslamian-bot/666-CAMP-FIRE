package com.campfire.dto;

import com.campfire.entity.enums.AnswerDecision;
import com.campfire.entity.enums.QuestionStatus;
import com.campfire.entity.enums.TargetType;

import java.util.List;
import java.util.UUID;

public class QuestionPublicDto {
    private UUID id;
    private String questionContent;
    private boolean isSensitive;
    private QuestionStatus status;

    // Assigned perspective player (who reads and interprets)
    private UUID assignedPlayerId;
    private String assignedDisplayName;
    private String initialAnswer;
    private AnswerDecision answerDecision;

    // Masked identities (ONLY populated in TARGET_REVEAL, AUTHOR_REVEAL, PERSPECTIVE_COMPARISON, SESSION_COMPLETE)
    private boolean isTargetRevealed;
    private TargetType targetType;
    private List<UUID> targetPlayerIds;
    private List<String> targetDisplayNames;

    private boolean isAuthorRevealed;
    private UUID authorPlayerId;
    private String authorDisplayName;

    // Post-reveal explanations
    private String actualTargetResponse;
    private String authorContext;

    public QuestionPublicDto() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getQuestionContent() { return questionContent; }
    public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }

    public boolean isSensitive() { return isSensitive; }
    public void setSensitive(boolean sensitive) { isSensitive = sensitive; }

    public QuestionStatus getStatus() { return status; }
    public void setStatus(QuestionStatus status) { this.status = status; }

    public UUID getAssignedPlayerId() { return assignedPlayerId; }
    public void setAssignedPlayerId(UUID assignedPlayerId) { this.assignedPlayerId = assignedPlayerId; }

    public String getAssignedDisplayName() { return assignedDisplayName; }
    public void setAssignedDisplayName(String assignedDisplayName) { this.assignedDisplayName = assignedDisplayName; }

    public String getInitialAnswer() { return initialAnswer; }
    public void setInitialAnswer(String initialAnswer) { this.initialAnswer = initialAnswer; }

    public AnswerDecision getAnswerDecision() { return answerDecision; }
    public void setAnswerDecision(AnswerDecision answerDecision) { this.answerDecision = answerDecision; }

    public boolean isTargetRevealed() { return isTargetRevealed; }
    public void setTargetRevealed(boolean targetRevealed) { isTargetRevealed = targetRevealed; }

    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }

    public List<UUID> getTargetPlayerIds() { return targetPlayerIds; }
    public void setTargetPlayerIds(List<UUID> targetPlayerIds) { this.targetPlayerIds = targetPlayerIds; }

    public List<String> getTargetDisplayNames() { return targetDisplayNames; }
    public void setTargetDisplayNames(List<String> targetDisplayNames) { this.targetDisplayNames = targetDisplayNames; }

    public boolean isAuthorRevealed() { return isAuthorRevealed; }
    public void setAuthorRevealed(boolean authorRevealed) { isAuthorRevealed = authorRevealed; }

    public UUID getAuthorPlayerId() { return authorPlayerId; }
    public void setAuthorPlayerId(UUID authorPlayerId) { this.authorPlayerId = authorPlayerId; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public String getActualTargetResponse() { return actualTargetResponse; }
    public void setActualTargetResponse(String actualTargetResponse) { this.actualTargetResponse = actualTargetResponse; }

    public String getAuthorContext() { return authorContext; }
    public void setAuthorContext(String authorContext) { this.authorContext = authorContext; }
}
