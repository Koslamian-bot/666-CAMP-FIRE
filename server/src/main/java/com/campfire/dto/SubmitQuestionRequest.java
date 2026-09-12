package com.campfire.dto;

import com.campfire.entity.enums.TargetType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public class SubmitQuestionRequest {
    @NotBlank
    @Size(max = 1000)
    private String questionContent;

    private boolean isSensitive = false;

    private TargetType targetType = TargetType.SINGLE;

    private List<UUID> targetPlayerIds;

    public SubmitQuestionRequest() {}

    public String getQuestionContent() { return questionContent; }
    public void setQuestionContent(String questionContent) { this.questionContent = questionContent; }

    public boolean isSensitive() { return isSensitive; }
    public void setSensitive(boolean sensitive) { isSensitive = sensitive; }

    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }

    public List<UUID> getTargetPlayerIds() { return targetPlayerIds; }
    public void setTargetPlayerIds(List<UUID> targetPlayerIds) { this.targetPlayerIds = targetPlayerIds; }
}
