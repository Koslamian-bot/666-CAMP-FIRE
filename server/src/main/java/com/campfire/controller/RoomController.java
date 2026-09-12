package com.campfire.controller;

import com.campfire.dto.*;
import com.campfire.game.GameService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RoomController {

    private final GameService gameService;

    public RoomController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/rooms/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Campfire burning bright 🔥");
    }

    @PostMapping("/rooms")
    public ResponseEntity<PlayerSessionDto> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        PlayerSessionDto session = gameService.createRoom(request);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/rooms/join")
    public ResponseEntity<PlayerSessionDto> joinRoom(@Valid @RequestBody JoinRoomRequest request) {
        PlayerSessionDto session = gameService.joinRoom(request);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/rooms/{roomCode}")
    public ResponseEntity<RoomStateDto> getRoomState(
            @PathVariable String roomCode,
            @RequestHeader(value = "X-Player-Token", required = false) String token) {
        RoomStateDto state = gameService.getRoomState(roomCode, token);
        return ResponseEntity.ok(state);
    }

    @PostMapping("/rooms/{roomCode}/start-disclaimer")
    public ResponseEntity<Void> startDisclaimer(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.startDisclaimerPhase(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/disclaimer")
    public ResponseEntity<Void> acceptDisclaimer(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.acceptDisclaimer(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/questions")
    public ResponseEntity<Void> submitQuestion(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token,
            @Valid @RequestBody SubmitQuestionRequest request) {
        gameService.submitQuestion(token, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/lock-submission")
    public ResponseEntity<Void> lockSubmissions(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.lockSubmissions(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/shuffle")
    public ResponseEntity<Void> shuffleAndAssign(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.shuffleAndAssign(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/spin")
    public ResponseEntity<Void> spinOrSelectSpeaker(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.spinOrSelectSpeaker(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/questions/{questionId}/answer")
    public ResponseEntity<Void> submitAnswer(
            @PathVariable UUID questionId,
            @RequestHeader("X-Player-Token") String token,
            @Valid @RequestBody SubmitAnswerRequest request) {
        gameService.submitAnswer(token, questionId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/questions/{questionId}/guess")
    public ResponseEntity<Void> submitGuess(
            @PathVariable UUID questionId,
            @RequestHeader("X-Player-Token") String token,
            @Valid @RequestBody SubmitGuessRequest request) {
        gameService.submitGuess(token, questionId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/complete-discussion")
    public ResponseEntity<Void> completeDiscussion(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.completeDiscussion(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/start-reveal")
    public ResponseEntity<Void> startReveal(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.startRevealPhase(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/reveal-author")
    public ResponseEntity<Void> revealAuthor(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.revealAuthor(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/perspective-comparison")
    public ResponseEntity<Void> moveToPerspectiveComparison(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.moveToPerspectiveComparison(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/questions/{questionId}/perspective-context")
    public ResponseEntity<Void> submitPerspectiveContext(
            @PathVariable UUID questionId,
            @RequestHeader("X-Player-Token") String token,
            @Valid @RequestBody SubmitPerspectiveContextRequest request) {
        gameService.submitPerspectiveContext(token, questionId, request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/next-reveal")
    public ResponseEntity<Void> nextReveal(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.nextRevealQuestion(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/rooms/{roomCode}/end-session")
    public ResponseEntity<Void> endSession(
            @PathVariable String roomCode,
            @RequestHeader("X-Player-Token") String token) {
        gameService.endSession(token, roomCode);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rooms/{roomCode}/perspective/{questionId}")
    public ResponseEntity<PerspectiveComparisonDto> getPerspectiveComparison(
            @PathVariable String roomCode,
            @PathVariable UUID questionId) {
        PerspectiveComparisonDto dto = gameService.getPerspectiveComparison(roomCode, questionId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/rooms/{roomCode}/summary")
    public ResponseEntity<SessionSummaryDto> getSessionSummary(
            @PathVariable String roomCode) {
        SessionSummaryDto summary = gameService.getSessionSummary(roomCode);
        return ResponseEntity.ok(summary);
    }
}
