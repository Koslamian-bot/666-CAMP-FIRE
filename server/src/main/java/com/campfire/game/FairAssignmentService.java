package com.campfire.game;

import com.campfire.entity.Player;
import com.campfire.entity.Question;
import com.campfire.entity.QuestionAssignment;
import com.campfire.entity.QuestionTarget;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FairAssignmentService {

    private static final Logger log = LoggerFactory.getLogger(FairAssignmentService.class);

    /**
     * Assigns questions to players for the initial perspective phase.
     * Rules:
     * 1. A player should preferably not receive their own question (assigned != author).
     * 2. A player should preferably not receive a question meant for themselves during perspective phase (assigned not in targets).
     * 3. Workloads should be as evenly balanced as possible across available players.
     * 4. Safe fallback for edge cases or small player groups.
     */
    public List<QuestionAssignment> createFairAssignments(
            List<Player> players,
            List<Question> questions,
            Map<UUID, List<QuestionTarget>> targetsByQuestionId) {

        if (players == null || players.isEmpty() || questions == null || questions.isEmpty()) {
            return Collections.emptyList();
        }

        List<UUID> playerIds = new ArrayList<>(players.stream().map(Player::getId).toList());
        List<Question> sortedQuestions = new ArrayList<>(questions);
        Collections.shuffle(sortedQuestions);

        // Precompute forbidden authors and targets for each question
        Map<UUID, Set<UUID>> forbiddenByQuestion = new HashMap<>();
        Map<UUID, Set<UUID>> targetsOnlyByQuestion = new HashMap<>();

        for (Question q : sortedQuestions) {
            Set<UUID> forbidden = new HashSet<>();
            forbidden.add(q.getAuthorPlayerId());

            Set<UUID> targets = new HashSet<>();
            List<QuestionTarget> qtList = targetsByQuestionId.getOrDefault(q.getId(), Collections.emptyList());
            for (QuestionTarget qt : qtList) {
                if (qt.getTargetType() == com.campfire.entity.enums.TargetType.EVERYONE) {
                    // Everyone is target, cannot avoid all targets, so only author is strictly avoided
                } else if (qt.getTargetPlayerId() != null) {
                    targets.add(qt.getTargetPlayerId());
                }
            }
            forbiddenByQuestion.put(q.getId(), forbidden);
            targetsOnlyByQuestion.put(q.getId(), targets);
        }

        // When questions count is roughly equal to player count, use maximum bipartite matching / Hungarian or greedy backtracker
        // to assign 1 question per player if questions.size() == players.size()
        Map<UUID, Integer> counts = new HashMap<>();
        for (UUID pid : playerIds) counts.put(pid, 0);

        List<QuestionAssignment> assignments = new ArrayList<>();

        // If 1-to-1 matching is possible, solve with backtracking
        if (questions.size() == players.size()) {
            Map<UUID, UUID> matching = new HashMap<>();
            if (findMatching(0, sortedQuestions, playerIds, forbiddenByQuestion, targetsOnlyByQuestion, matching, new HashSet<>())) {
                for (Question q : sortedQuestions) {
                    UUID assignedPid = matching.get(q.getId());
                    assignments.add(new QuestionAssignment(q.getId(), assignedPid));
                }
                log.info("Created optimal 1-to-1 fair assignments for {} questions", assignments.size());
                return assignments;
            }
        }

        // Fallback greedy balancing
        for (Question q : sortedQuestions) {
            Set<UUID> forbidden = forbiddenByQuestion.get(q.getId());
            Set<UUID> targets = targetsOnlyByQuestion.get(q.getId());

            List<UUID> candidates = new ArrayList<>(playerIds);
            // Sort by lowest assigned count first, then random
            Collections.shuffle(candidates);
            candidates.sort(Comparator.comparingInt(counts::get));

            UUID picked = null;
            // Best: not author and not target
            for (UUID pid : candidates) {
                if (!forbidden.contains(pid) && !targets.contains(pid)) {
                    picked = pid;
                    break;
                }
            }
            // Next best: not author
            if (picked == null) {
                for (UUID pid : candidates) {
                    if (!forbidden.contains(pid)) {
                        picked = pid;
                        break;
                    }
                }
            }
            // Fallback: anyone with lowest count
            if (picked == null) {
                picked = candidates.get(0);
            }

            counts.put(picked, counts.get(picked) + 1);
            assignments.add(new QuestionAssignment(q.getId(), picked));
        }

        return assignments;
    }

    private boolean findMatching(
            int qIndex,
            List<Question> questions,
            List<UUID> playerIds,
            Map<UUID, Set<UUID>> forbidden,
            Map<UUID, Set<UUID>> targets,
            Map<UUID, UUID> currentMatching,
            Set<UUID> usedPlayers) {

        if (qIndex == questions.size()) {
            return true;
        }

        Question q = questions.get(qIndex);
        Set<UUID> forb = forbidden.get(q.getId());
        Set<UUID> targ = targets.get(q.getId());

        // Try players that are not forbidden and not target
        List<UUID> shuffled = new ArrayList<>(playerIds);
        Collections.shuffle(shuffled);

        for (UUID pid : shuffled) {
            if (!usedPlayers.contains(pid) && !forb.contains(pid) && !targ.contains(pid)) {
                usedPlayers.add(pid);
                currentMatching.put(q.getId(), pid);
                if (findMatching(qIndex + 1, questions, playerIds, forbidden, targets, currentMatching, usedPlayers)) {
                    return true;
                }
                usedPlayers.remove(pid);
                currentMatching.remove(q.getId());
            }
        }

        // Relax target constraint if strict not found
        for (UUID pid : shuffled) {
            if (!usedPlayers.contains(pid) && !forb.contains(pid)) {
                usedPlayers.add(pid);
                currentMatching.put(q.getId(), pid);
                if (findMatching(qIndex + 1, questions, playerIds, forbidden, targets, currentMatching, usedPlayers)) {
                    return true;
                }
                usedPlayers.remove(pid);
                currentMatching.remove(q.getId());
            }
        }

        return false;
    }
}
