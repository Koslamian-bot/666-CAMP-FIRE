package com.campfire.dto;

import java.util.UUID;

public class SubmitGuessRequest {
    private UUID guessedAuthorId;
    private UUID guessedTargetId;

    public SubmitGuessRequest() {}

    public SubmitGuessRequest(UUID guessedAuthorId, UUID guessedTargetId) {
        this.guessedAuthorId = guessedAuthorId;
        this.guessedTargetId = guessedTargetId;
    }

    public UUID getGuessedAuthorId() { return guessedAuthorId; }
    public void setGuessedAuthorId(UUID guessedAuthorId) { this.guessedAuthorId = guessedAuthorId; }

    public UUID getGuessedTargetId() { return guessedTargetId; }
    public void setGuessedTargetId(UUID guessedTargetId) { this.guessedTargetId = guessedTargetId; }
}
