package com.campfire.game;

import com.campfire.dto.RoomStateDto;
import com.campfire.entity.*;
import com.campfire.entity.enums.GameState;
import com.campfire.entity.enums.QuestionStatus;
import com.campfire.repository.*;
import com.campfire.websocket.GameNotifier;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VisibilitySecurityTest {

    @Mock private RoomRepository roomRepository;
    @Mock private PlayerRepository playerRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private QuestionTargetRepository questionTargetRepository;
    @Mock private QuestionAssignmentRepository questionAssignmentRepository;
    @Mock private GuessRepository guessRepository;
    @Mock private GameNotifier gameNotifier;

    private FairAssignmentService fairAssignmentService = new FairAssignmentService();

    @InjectMocks
    private GameService gameService;

    @Test
    void testQuestionMetadataHiddenDuringDiscussionPhase() {
        String roomCode = "6CF-999";
        UUID roomId = UUID.randomUUID();
        UUID authorId = UUID.randomUUID();
        UUID targetId = UUID.randomUUID();
        UUID assignedId = UUID.randomUUID();
        UUID questionId = UUID.randomUUID();

        Room room = new Room(roomCode, "Campfire Room", "Lore", 8, null);
        room.setId(roomId);
        room.setGameState(GameState.QUESTION_DISCUSSION);
        room.setCurrentQuestionId(questionId);

        Player author = new Player(roomId, "Karthik", "flame-1", "token-1");
        author.setId(authorId);

        Player target = new Player(roomId, "Arun", "flame-2", "token-2");
        target.setId(targetId);

        Player interpreter = new Player(roomId, "Priya", "flame-3", "token-3");
        interpreter.setId(assignedId);

        Question question = new Question(roomId, authorId, "Why did that situation become awkward between us?", false);
        question.setId(questionId);
        question.setStatus(QuestionStatus.DISCUSSING);

        QuestionAssignment qa = new QuestionAssignment(questionId, assignedId);
        qa.setInitialAnswer("I think it was a miscommunication at the café.");

        when(roomRepository.findByRoomCode(roomCode)).thenReturn(Optional.of(room));
        when(playerRepository.findByRoomIdOrderByJoinedAtAsc(roomId)).thenReturn(List.of(author, target, interpreter));
        when(questionRepository.findByRoomIdOrderByCreatedAtAsc(roomId)).thenReturn(List.of(question));
        when(questionRepository.findById(questionId)).thenReturn(Optional.of(question));
        when(questionAssignmentRepository.findByQuestionId(questionId)).thenReturn(Optional.of(qa));

        RoomStateDto state = gameService.getRoomState(roomCode, "token-3");

        assertNotNull(state.getActiveQuestion());
        assertEquals("Why did that situation become awkward between us?", state.getActiveQuestion().getQuestionContent());
        assertEquals("Priya", state.getActiveQuestion().getAssignedDisplayName());

        // CRITICAL PRIVACY CHECKS:
        // Must NOT leak author or target during discussion
        assertFalse(state.getActiveQuestion().isAuthorRevealed());
        assertNull(state.getActiveQuestion().getAuthorPlayerId(), "Author ID must remain hidden during discussion!");
        assertNull(state.getActiveQuestion().getAuthorDisplayName(), "Author name must remain hidden during discussion!");

        assertFalse(state.getActiveQuestion().isTargetRevealed());
        assertNull(state.getActiveQuestion().getTargetPlayerIds(), "Target IDs must remain hidden during discussion!");
    }
}
