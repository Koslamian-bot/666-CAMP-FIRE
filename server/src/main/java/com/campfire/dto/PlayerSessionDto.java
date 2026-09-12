package com.campfire.dto;

import java.util.UUID;

public class PlayerSessionDto {
    private String token;
    private UUID playerId;
    private UUID roomId;
    private String roomCode;
    private String displayName;
    private String avatarSeed;
    private boolean isHost;

    public PlayerSessionDto() {}

    public PlayerSessionDto(String token, UUID playerId, UUID roomId, String roomCode, String displayName, String avatarSeed, boolean isHost) {
        this.token = token;
        this.playerId = playerId;
        this.roomId = roomId;
        this.roomCode = roomCode;
        this.displayName = displayName;
        this.avatarSeed = avatarSeed;
        this.isHost = isHost;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UUID getPlayerId() { return playerId; }
    public void setPlayerId(UUID playerId) { this.playerId = playerId; }

    public UUID getRoomId() { return roomId; }
    public void setRoomId(UUID roomId) { this.roomId = roomId; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarSeed() { return avatarSeed; }
    public void setAvatarSeed(String avatarSeed) { this.avatarSeed = avatarSeed; }

    public boolean isHost() { return isHost; }
    public void setHost(boolean host) { isHost = host; }
}
