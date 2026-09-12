package com.campfire.dto;

import java.util.UUID;

public class PlayerDto {
    private UUID id;
    private String displayName;
    private String avatarSeed;
    private boolean isConnected;
    private boolean disclaimerAccepted;

    public PlayerDto() {}

    public PlayerDto(UUID id, String displayName, String avatarSeed, boolean isConnected, boolean disclaimerAccepted) {
        this.id = id;
        this.displayName = displayName;
        this.avatarSeed = avatarSeed;
        this.isConnected = isConnected;
        this.disclaimerAccepted = disclaimerAccepted;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getAvatarSeed() { return avatarSeed; }
    public void setAvatarSeed(String avatarSeed) { this.avatarSeed = avatarSeed; }

    public boolean isConnected() { return isConnected; }
    public void setConnected(boolean connected) { isConnected = connected; }

    public boolean isDisclaimerAccepted() { return disclaimerAccepted; }
    public void setDisclaimerAccepted(boolean disclaimerAccepted) { this.disclaimerAccepted = disclaimerAccepted; }
}
