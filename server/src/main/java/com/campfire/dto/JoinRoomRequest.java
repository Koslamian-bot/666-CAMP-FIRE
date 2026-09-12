package com.campfire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JoinRoomRequest {
    @NotBlank
    private String roomCode;

    @NotBlank
    @Size(max = 40)
    private String displayName;

    private String avatarSeed;

    private String password;

    public JoinRoomRequest() {}

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarSeed() { return avatarSeed; }
    public void setAvatarSeed(String avatarSeed) { this.avatarSeed = avatarSeed; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
