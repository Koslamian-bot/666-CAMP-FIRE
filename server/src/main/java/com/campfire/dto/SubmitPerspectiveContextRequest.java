package com.campfire.dto;

import jakarta.validation.constraints.Size;

public class SubmitPerspectiveContextRequest {
    @Size(max = 2000)
    private String actualTargetResponse;

    @Size(max = 2000)
    private String authorContext;

    public SubmitPerspectiveContextRequest() {}

    public SubmitPerspectiveContextRequest(String actualTargetResponse, String authorContext) {
        this.actualTargetResponse = actualTargetResponse;
        this.authorContext = authorContext;
    }

    public String getActualTargetResponse() { return actualTargetResponse; }
    public void setActualTargetResponse(String actualTargetResponse) { this.actualTargetResponse = actualTargetResponse; }

    public String getAuthorContext() { return authorContext; }
    public void setAuthorContext(String authorContext) { this.authorContext = authorContext; }
}
