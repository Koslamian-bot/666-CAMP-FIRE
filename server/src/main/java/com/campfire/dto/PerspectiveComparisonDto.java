package com.campfire.dto;

import com.campfire.entity.enums.AnswerDecision;
import com.campfire.entity.enums.TargetType;

import java.util.List;
import java.util.UUID;

public class PerspectiveComparisonDto {
    private UUID questionId;
    private String questionContent;
    private boolean isSensitive;

    // Interpreter
    private UUID initialInterpreterId;
    private String initialInterpreterName;
    private String initialAnswer;
    private AnswerDecision answerDecision;

    // Intended Target
    private TargetType targetType;
    private List<UUID> targetPlayerIds;
    private List<String> targetNames;
    private String actualTargetResponse;

    // Author
    private UUID authorId;
    private String authorName;
    private String authorContext;

    // Room Guesses Summary
    private int totalGuesses;
    private int correctAuthorGuesses;
    private int correctTargetGuesses;

    public PerspectiveComparisonDto() {}

    public UUID getQuestionId() { return questionId; }
    public void setQuestionId(UUID questionId) { this.questionId = questionId; }

    public String getQuestionContent() { return questionContent; }
    public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }

    public boolean isSensitive() { return isSensitive; }
    public void setSensitive(boolean sensitive) { isSensitive = sensitive; }

    public UUID getInitialInterpreterId() { return initialInterpreterId; }
    public void setInitialInterpreterId(UUID initialInterpreterId) { this.initialInterpreterId = initialInterpreterId; }

    public String getInitialInterpreterName() { return initialInterpreterName; }
    public void setInitialInterpreterName(String initialInterpreterName) { this.initialInterpreterName = initialInterpreterName; }

    public String getInitialAnswer() { return initialAnswer; }
    public void setInitialAnswer(String initialAnswer) { this.initialAnswer = initialAnswer; }

    public AnswerDecision getAnswerDecision() { return answerDecision; }
    public void setAnswerDecision(AnswerDecision answerDecision) { this.answerDecision = answerDecision; }

    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }

    public List<UUID> getTargetPlayerIds() { return targetPlayerIds; }
    public void setTargetPlayerIds(List<UUID> targetPlayerIds) { this.targetPlayerIds = targetPlayerIds; }

    public List<String> getTargetNames() { return targetNames; }
    public void setTargetNames(List<String> targetNames) { this.targetNames = targetNames; }

    public String getActualTargetResponse() { return actualTargetResponse; }
    public void setActualTargetResponse(String actualTargetResponse) { this.actualTargetResponse = actualTargetResponse; }

    public UUID getAuthorId() { return authorId; }
    public void setAuthorId(UUID authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorContext() { return authorContext; }
    public void setAuthorContext(String authorContext) { this.authorContext = authorContext; }

    public int getTotalGuesses() { return totalGuesses; }
    public void setTotalGuesses(int totalGuesses) { this.totalGuesses = totalGuesses; }

    public int getCorrectAuthorGuesses() { return correctAuthorGuesses; }
    public void setCorrectAuthorGuesses(int correctAuthorGuesses) { this.correctAuthorGuesses = correctAuthorGuesses; }

    public int getCorrectTargetGuesses() { return correctTargetGuesses; }
    public void setCorrectTargetGuesses(int correctTargetGuesses) { this.correctTargetGuesses = correctTargetGuesses; }
}
