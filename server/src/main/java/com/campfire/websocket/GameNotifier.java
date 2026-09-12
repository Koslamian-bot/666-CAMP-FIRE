package com.campfire.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class GameNotifier {

    private static final Logger log = LoggerFactory.getLogger(GameNotifier.class);
    private final SimpMessagingTemplate messagingTemplate;

    public GameNotifier(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notifyRoom(String roomCode, Object payload) {
        String destination = "/topic/room/" + roomCode;
        log.debug("Broadcasting to {}", destination);
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void notifyEvent(String roomCode, String eventType, Object data) {
        String destination = "/topic/room/" + roomCode + "/events";
        messagingTemplate.convertAndSend(destination, Map.of(
                "type", eventType,
                "data", data,
                "timestamp", System.currentTimeMillis()
        ));
    }
}
