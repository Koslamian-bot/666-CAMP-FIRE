package com.campfire.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID roomId;

    @Column(nullable = false, length = 50)
    private String displayName;

    @Column(length = 50)
    private String avatarSeed;

    @Column(nullable = false, unique = true, length = 64)
    private String sessionToken;

    @Column(nullable = false)
    private boolean disclaimerAccepted = false;

    @Column(nullable = false)
    private boolean isConnected = true;

    @Column(nullable = false)
    private Instant joinedAt = Instant.now();

    public Player() {}

    public Player(UUID roomId, String displayName, String avatarSeed, String sessionToken) {
        this.roomId = roomId;
        this.displayName = displayName;
        this.avatarSeed = avatarSeed;
        this.sessionToken = sessionToken;
        this.disclaimerAccepted = false;
        this.isConnected = true;
        this.joinedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRoomId() { return roomId; }
    public void setRoomId(UUID roomId) { this.roomId = roomId; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarSeed() { return avatarSeed; }
    public void setAvatarSeed(String avatarSeed) { this.avatarSeed = avatarSeed; }

    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }

    public boolean isDisclaimerAccepted() { return disclaimerAccepted; }
    public void setDisclaimerAccepted(boolean disclaimerAccepted) { this.disclaimerAccepted = disclaimerAccepted; }

    public boolean isConnected() { return isConnected; }
    public void setConnected(boolean connected) { isConnected = connected; }

    public Instant getJoinedAt() { return joinedAt; }
    public void setJoinedAt(Instant joinedAt) { this.joinedAt = joinedAt; }
}
