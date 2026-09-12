package com.campfire.dto;

import java.util.List;

public class SessionSummaryDto {
    private int totalQuestions;
    private int totalAnswered;
    private int totalPassed;
    private int totalGuessesSubmitted;
    private int correctAuthorGuesses;
    private int correctTargetGuesses;
    private List<PerspectiveComparisonDto> comparisons;
    private String closingMessage = "You entered with assumptions. The fire heard everyone's version.";

    public SessionSummaryDto() {}

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getTotalAnswered() { return totalAnswered; }
    public void setTotalAnswered(int totalAnswered) { this.totalAnswered = totalAnswered; }

    public int getTotalPassed() { return totalPassed; }
    public void setTotalPassed(int totalPassed) { this.totalPassed = totalPassed; }

    public int getTotalGuessesSubmitted() { return totalGuessesSubmitted; }
    public void setTotalGuessesSubmitted(int totalGuessesSubmitted) { this.totalGuessesSubmitted = totalGuessesSubmitted; }

    public int getCorrectAuthorGuesses() { return correctAuthorGuesses; }
    public void setCorrectAuthorGuesses(int correctAuthorGuesses) { this.correctAuthorGuesses = correctAuthorGuesses; }

    public int getCorrectTargetGuesses() { return correctTargetGuesses; }
    public void setCorrectTargetGuesses(int correctTargetGuesses) { this.correctTargetGuesses = correctTargetGuesses; }

    public List<PerspectiveComparisonDto> getComparisons() { return comparisons; }
    public void setComparisons(List<PerspectiveComparisonDto> comparisons) { this.comparisons = comparisons; }

    public String getClosingMessage() { return closingMessage; }
    public void setClosingMessage(String closingMessage) { this.closingMessage = closingMessage; }
}
