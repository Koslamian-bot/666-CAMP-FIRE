package com.campfire.dto;

import com.campfire.entity.enums.AnswerDecision;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SubmitAnswerRequest {
    @NotNull
    private AnswerDecision answerDecision;

    @Size(max = 2000)
    private String initialAnswer;

    public SubmitAnswerRequest() {}

    public SubmitAnswerRequest(AnswerDecision answerDecision, String initialAnswer) {
        this.answerDecision = answerDecision;
        this.initialAnswer = initialAnswer;
    }

    public AnswerDecision getAnswerDecision() { return answerDecision; }
    public void setAnswerDecision(AnswerDecision answerDecision) { this.answerDecision = answerDecision; }

    public String getInitialAnswer() { return initialAnswer; }
    public void setInitialAnswer(String initialAnswer) { this.initialAnswer = initialAnswer; }
}
