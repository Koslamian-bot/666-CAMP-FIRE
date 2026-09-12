package com.campfire.dto;

import com.campfire.entity.enums.GameMode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateRoomRequest {
    @NotBlank
    @Size(max = 80)
    private String roomName;

    @Size(max = 120)
    private String theme;

    private int maxPlayers = 16;

    private String password;

    private GameMode gameMode = GameMode.DIGITAL_SPINNER;

    @NotBlank
    @Size(max = 40)
    private String hostDisplayName;

    private String hostAvatarSeed;

    public CreateRoomRequest() {}

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public GameMode getGameMode() { return gameMode; }
    public void setGameMode(GameMode gameMode) { this.gameMode = gameMode; }

    public String getHostDisplayName() { return hostDisplayName; }
    public void setHostDisplayName(String hostDisplayName) { this.hostDisplayName = hostDisplayName; }

    public String getHostAvatarSeed() { return hostAvatarSeed; }
    public void setHostAvatarSeed(String hostAvatarSeed) { this.hostAvatarSeed = hostAvatarSeed; }
}
