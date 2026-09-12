package com.campfire.dto;

import com.campfire.entity.enums.GameMode;
import com.campfire.entity.enums.GameState;

import java.util.List;
import java.util.UUID;

public class RoomStateDto {
    private UUID roomId;
    private String roomCode;
    private String roomName;
    private String theme;
    private GameState gameState;
    private GameMode gameMode;
    private UUID hostPlayerId;
    private int maxPlayers;
    private List<PlayerDto> players;

    private int currentQuestionIndex;
    private int totalQuestions;

    private UUID currentSpeakerPlayerId;
    private String currentSpeakerName;

    private QuestionPublicDto activeQuestion;
    private QuestionPublicDto myAssignedQuestion;

    private int disclaimerAcceptedCount;
    private int totalSubmittedQuestions;
    private boolean myQuestionSubmitted;
    private boolean myGuessSubmitted;

    public RoomStateDto() {}

    public UUID getRoomId() { return roomId; }
    public void setRoomId(UUID roomId) { this.roomId = roomId; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public GameState getGameState() { return gameState; }
    public void setGameState(GameState gameState) { this.gameState = gameState; }

    public GameMode getGameMode() { return gameMode; }
    public void setGameMode(GameMode gameMode) { this.gameMode = gameMode; }

    public UUID getHostPlayerId() { return hostPlayerId; }
    public void setHostPlayerId(UUID hostPlayerId) { this.hostPlayerId = hostPlayerId; }

    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }

    public List<PlayerDto> getPlayers() { return players; }
    public void setPlayers(List<PlayerDto> players) { this.players = players; }

    public int getCurrentQuestionIndex() { return currentQuestionIndex; }
    public void setCurrentQuestionIndex(int currentQuestionIndex) { this.currentQuestionIndex = currentQuestionIndex; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public UUID getCurrentSpeakerPlayerId() { return currentSpeakerPlayerId; }
    public void setCurrentSpeakerPlayerId(UUID currentSpeakerPlayerId) { this.currentSpeakerPlayerId = currentSpeakerPlayerId; }

    public String getCurrentSpeakerName() { return currentSpeakerName; }
    public void setCurrentSpeakerName(String currentSpeakerName) { this.currentSpeakerName = currentSpeakerName; }

    public QuestionPublicDto getActiveQuestion() { return activeQuestion; }
    public void setActiveQuestion(QuestionPublicDto activeQuestion) { this.activeQuestion = activeQuestion; }

    public QuestionPublicDto getMyAssignedQuestion() { return myAssignedQuestion; }
    public void setMyAssignedQuestion(QuestionPublicDto myAssignedQuestion) { this.myAssignedQuestion = myAssignedQuestion; }

    public int getDisclaimerAcceptedCount() { return disclaimerAcceptedCount; }
    public void setDisclaimerAcceptedCount(int disclaimerAcceptedCount) { this.disclaimerAcceptedCount = disclaimerAcceptedCount; }

    public int getTotalSubmittedQuestions() { return totalSubmittedQuestions; }
    public void setTotalSubmittedQuestions(int totalSubmittedQuestions) { this.totalSubmittedQuestions = totalSubmittedQuestions; }

    public boolean isMyQuestionSubmitted() { return myQuestionSubmitted; }
    public void setMyQuestionSubmitted(boolean myQuestionSubmitted) { this.myQuestionSubmitted = myQuestionSubmitted; }

    public boolean isMyGuessSubmitted() { return myGuessSubmitted; }
    public void setMyGuessSubmitted(boolean myGuessSubmitted) { this.myGuessSubmitted = myGuessSubmitted; }
}
