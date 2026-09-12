package com.campfire.game;

import com.campfire.entity.Player;
import com.campfire.entity.Question;
import com.campfire.entity.QuestionAssignment;
import com.campfire.entity.QuestionTarget;
import com.campfire.entity.enums.TargetType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class FairAssignmentServiceTest {

    private FairAssignmentService fairAssignmentService;

    @BeforeEach
    void setUp() {
        fairAssignmentService = new FairAssignmentService();
    }

    @Test
    void testFairAssignmentAvoidsSelfAssignmentInGroup() {
        UUID roomId = UUID.randomUUID();

        // 4 players
        List<Player> players = new ArrayList<>();
        for (int i = 1; i <= 4; i++) {
            Player p = new Player(roomId, "Player " + i, "flame-" + i, "token-" + i);
            p.setId(UUID.randomUUID());
            players.add(p);
        }

        // Each player asks 1 question targeting someone else
        List<Question> questions = new ArrayList<>();
        Map<UUID, List<QuestionTarget>> targets = new HashMap<>();

        for (int i = 0; i < players.size(); i++) {
            Player author = players.get(i);
            Player target = players.get((i + 1) % players.size());

            Question q = new Question(roomId, author.getId(), "Question from " + author.getDisplayName(), false);
            q.setId(UUID.randomUUID());
            questions.add(q);

            targets.put(q.getId(), List.of(new QuestionTarget(q.getId(), target.getId(), TargetType.SINGLE)));
        }

        List<QuestionAssignment> assignments = fairAssignmentService.createFairAssignments(players, questions, targets);

        assertEquals(4, assignments.size());

        // Check that no player is assigned their own question
        for (QuestionAssignment qa : assignments) {
            Question q = questions.stream().filter(x -> x.getId().equals(qa.getQuestionId())).findFirst().orElseThrow();
            assertNotEquals(q.getAuthorPlayerId(), qa.getAssignedPlayerId(),
                    "Assigned player should not be the author of the question!");
        }

        // Check that all players have equal assignments (1 each)
        Set<UUID> assignedPlayers = new HashSet<>();
        for (QuestionAssignment qa : assignments) {
            assignedPlayers.add(qa.getAssignedPlayerId());
        }
        assertEquals(4, assignedPlayers.size(), "Every player should receive a question");
    }
}
