package com.campfire.entity;

import com.campfire.entity.enums.GameMode;
import com.campfire.entity.enums.GameState;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 16)
    private String roomCode;

    @Column(nullable = false, length = 100)
    private String roomName;

    @Column(length = 150)
    private String theme;

    @Column(nullable = false)
    private UUID hostPlayerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameState gameState = GameState.LOBBY;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GameMode gameMode = GameMode.DIGITAL_SPINNER;

    @Column(nullable = false)
    private int maxPlayers = 16;

    @Column(length = 255)
    private String passwordHash;

    private Integer currentQuestionIndex = 0;

    private UUID currentSpeakerPlayerId;

    private UUID currentQuestionId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public Room() {}

    public Room(String roomCode, String roomName, String theme, int maxPlayers, GameMode gameMode) {
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.theme = theme;
        this.maxPlayers = maxPlayers;
        this.gameMode = gameMode != null ? gameMode : GameMode.DIGITAL_SPINNER;
        this.gameState = GameState.LOBBY;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public UUID getHostPlayerId() { return hostPlayerId; }
    public void setHostPlayerId(UUID hostPlayerId) { this.hostPlayerId = hostPlayerId; }

    public GameState getGameState() { return gameState; }
    public void setGameState(GameState gameState) { this.gameState = gameState; this.updatedAt = Instant.now(); }

    public GameMode getGameMode() { return gameMode; }
    public void setGameMode(GameMode gameMode) { this.gameMode = gameMode; }

    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getCurrentQuestionIndex() { return currentQuestionIndex; }
    public void setCurrentQuestionIndex(Integer currentQuestionIndex) { this.currentQuestionIndex = currentQuestionIndex; }

    public UUID getCurrentSpeakerPlayerId() { return currentSpeakerPlayerId; }
    public void setCurrentSpeakerPlayerId(UUID currentSpeakerPlayerId) { this.currentSpeakerPlayerId = currentSpeakerPlayerId; }

    public UUID getCurrentQuestionId() { return currentQuestionId; }
    public void setCurrentQuestionId(UUID currentQuestionId) { this.currentQuestionId = currentQuestionId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
