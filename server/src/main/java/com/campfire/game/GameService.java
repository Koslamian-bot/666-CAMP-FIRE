package com.campfire.game;

import com.campfire.dto.*;
import com.campfire.entity.*;
import com.campfire.entity.enums.*;
import com.campfire.repository.*;
import com.campfire.websocket.GameNotifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final RoomRepository roomRepository;
    private final PlayerRepository playerRepository;
    private final QuestionRepository questionRepository;
    private final QuestionTargetRepository questionTargetRepository;
    private final QuestionAssignmentRepository questionAssignmentRepository;
    private final GuessRepository guessRepository;
    private final FairAssignmentService fairAssignmentService;
    private final GameNotifier gameNotifier;

    public GameService(
            RoomRepository roomRepository,
            PlayerRepository playerRepository,
            QuestionRepository questionRepository,
            QuestionTargetRepository questionTargetRepository,
            QuestionAssignmentRepository questionAssignmentRepository,
            GuessRepository guessRepository,
            FairAssignmentService fairAssignmentService,
            GameNotifier gameNotifier) {
        this.roomRepository = roomRepository;
        this.playerRepository = playerRepository;
        this.questionRepository = questionRepository;
        this.questionTargetRepository = questionTargetRepository;
        this.questionAssignmentRepository = questionAssignmentRepository;
        this.guessRepository = guessRepository;
        this.fairAssignmentService = fairAssignmentService;
        this.gameNotifier = gameNotifier;
    }

    private String generateRoomCode() {
        String[] prefixes = {"6CF", "FIRE", "CAMP", "LORE", "ASH", "EMBER"};
        for (int attempt = 0; attempt < 20; attempt++) {
            String prefix = prefixes[RANDOM.nextInt(prefixes.length)];
            int number = 100 + RANDOM.nextInt(900);
            String code = prefix + "-" + number;
            if (!roomRepository.existsByRoomCode(code)) {
                return code;
            }
        }
        return "6CF-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private String generateSessionToken() {
        return UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
    }

    @Transactional
    public PlayerSessionDto createRoom(CreateRoomRequest request) {
        String code = generateRoomCode();
        Room room = new Room(
                code,
                request.getRoomName().trim(),
                request.getTheme() != null ? request.getTheme().trim() : null,
                request.getMaxPlayers() > 0 ? request.getMaxPlayers() : 16,
                request.getGameMode()
        );

        // Temp placeholder for host, will update once player is persisted
        room.setHostPlayerId(UUID.randomUUID());
        room = roomRepository.save(room);

        String token = generateSessionToken();
        String avatar = request.getHostAvatarSeed() != null ? request.getHostAvatarSeed() : "flame-1";
        Player host = new Player(room.getId(), request.getHostDisplayName().trim(), avatar, token);
        host = playerRepository.save(host);

        room.setHostPlayerId(host.getId());
        roomRepository.save(room);

        return new PlayerSessionDto(token, host.getId(), room.getId(), room.getRoomCode(), host.getDisplayName(), host.getAvatarSeed(), true);
    }

    @Transactional
    public PlayerSessionDto joinRoom(JoinRoomRequest request) {
        Room room = roomRepository.findByRoomCode(request.getRoomCode().trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Campfire room not found: " + request.getRoomCode()));

        long currentCount = playerRepository.countByRoomId(room.getId());
        if (currentCount >= room.getMaxPlayers()) {
            throw new IllegalStateException("This campfire circle is full (" + room.getMaxPlayers() + " players)");
        }

        // Check if player with same name already exists in room
        Optional<Player> existing = playerRepository.findByRoomIdAndDisplayNameIgnoreCase(room.getId(), request.getDisplayName().trim());
        Player player;
        if (existing.isPresent()) {
            player = existing.get();
            player.setConnected(true);
            playerRepository.save(player);
        } else {
            String token = generateSessionToken();
            String avatar = request.getAvatarSeed() != null ? request.getAvatarSeed() : "flame-" + (RANDOM.nextInt(6) + 1);
            player = new Player(room.getId(), request.getDisplayName().trim(), avatar, token);
            player = playerRepository.save(player);
        }

        boolean isHost = room.getHostPlayerId().equals(player.getId());
        broadcastRoomUpdate(room.getRoomCode());
        return new PlayerSessionDto(player.getSessionToken(), player.getId(), room.getId(), room.getRoomCode(), player.getDisplayName(), player.getAvatarSeed(), isHost);
    }

    @Transactional
    public void acceptDisclaimer(String playerToken) {
        Player player = getPlayerByToken(playerToken);
        player.setDisclaimerAccepted(true);
        playerRepository.save(player);

        Room room = roomRepository.findById(player.getRoomId())
                .orElseThrow(() -> new IllegalStateException("Room not found"));

        // If all players in lobby accepted disclaimer and state is DISCLAIMER, move to QUESTION_SUBMISSION
        List<Player> players = playerRepository.findByRoomIdOrderByJoinedAtAsc(room.getId());
        boolean allAccepted = players.stream().allMatch(Player::isDisclaimerAccepted);
        if (room.getGameState() == GameState.DISCLAIMER && allAccepted) {
            room.setGameState(GameState.QUESTION_SUBMISSION);
            roomRepository.save(room);
        }

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void startDisclaimerPhase(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        room.setGameState(GameState.DISCLAIMER);
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void submitQuestion(String playerToken, SubmitQuestionRequest request) {
        Player player = getPlayerByToken(playerToken);
        Room room = roomRepository.findById(player.getRoomId())
                .orElseThrow(() -> new IllegalStateException("Room not found"));

        if (room.getGameState() != GameState.QUESTION_SUBMISSION) {
            throw new IllegalStateException("Question submission is not active");
        }

        Question question = new Question(
                room.getId(),
                player.getId(),
                request.getQuestionContent().trim(),
                request.isSensitive()
        );
        question = questionRepository.save(question);

        // Save target(s)
        TargetType targetType = request.getTargetType() != null ? request.getTargetType() : TargetType.SINGLE;
        if (targetType == TargetType.EVERYONE) {
            QuestionTarget target = new QuestionTarget(question.getId(), null, TargetType.EVERYONE);
            questionTargetRepository.save(target);
        } else if (request.getTargetPlayerIds() != null && !request.getTargetPlayerIds().isEmpty()) {
            for (UUID targetPid : request.getTargetPlayerIds()) {
                QuestionTarget target = new QuestionTarget(question.getId(), targetPid, targetType);
                questionTargetRepository.save(target);
            }
        } else {
            // Default to everyone if no target provided
            QuestionTarget target = new QuestionTarget(question.getId(), null, TargetType.EVERYONE);
            questionTargetRepository.save(target);
        }

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void lockSubmissions(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        room.setGameState(GameState.SUBMISSION_LOCKED);
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void shuffleAndAssign(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        List<Player> players = playerRepository.findByRoomIdOrderByJoinedAtAsc(room.getId());
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());

        if (questions.isEmpty()) {
            throw new IllegalStateException("No questions submitted to shuffle!");
        }

        // Map targets for fair assignment
        Map<UUID, List<QuestionTarget>> targetsByQuestion = new HashMap<>();
        for (Question q : questions) {
            targetsByQuestion.put(q.getId(), questionTargetRepository.findByQuestionId(q.getId()));
        }

        // Clear any previous assignments if re-shuffling
        for (Question q : questions) {
            questionAssignmentRepository.deleteByQuestionId(q.getId());
        }

        List<QuestionAssignment> assignments = fairAssignmentService.createFairAssignments(players, questions, targetsByQuestion);
        for (QuestionAssignment qa : assignments) {
            questionAssignmentRepository.save(qa);
        }

        room.setGameState(GameState.CHOOSING_SPEAKER);
        room.setCurrentQuestionIndex(0);
        room.setCurrentSpeakerPlayerId(null);
        room.setCurrentQuestionId(null);
        roomRepository.save(room);

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void spinOrSelectSpeaker(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());

        // Find next un-discussed question assignment
        QuestionAssignment nextAssignment = null;
        Question targetQuestion = null;

        for (Question q : questions) {
            Optional<QuestionAssignment> qaOpt = questionAssignmentRepository.findByQuestionId(q.getId());
            if (qaOpt.isPresent() && !qaOpt.get().isDiscussionCompleted()) {
                nextAssignment = qaOpt.get();
                targetQuestion = q;
                break;
            }
        }

        if (nextAssignment == null || targetQuestion == null) {
            // All questions have been discussed! Transition to ALL_QUESTIONS_COMPLETE
            room.setGameState(GameState.ALL_QUESTIONS_COMPLETE);
            room.setCurrentSpeakerPlayerId(null);
            room.setCurrentQuestionId(null);
            roomRepository.save(room);
            broadcastRoomUpdate(room.getRoomCode());
            return;
        }

        Player selectedSpeaker = playerRepository.findById(nextAssignment.getAssignedPlayerId())
                .orElseThrow(() -> new IllegalStateException("Speaker player not found"));

        room.setCurrentSpeakerPlayerId(selectedSpeaker.getId());
        room.setCurrentQuestionId(targetQuestion.getId());
        room.setGameState(GameState.QUESTION_ANSWERING);
        targetQuestion.setStatus(QuestionStatus.ANSWERING);
        questionRepository.save(targetQuestion);
        roomRepository.save(room);

        // Broadcast spinner event for dramatic animation
        gameNotifier.notifyEvent(room.getRoomCode(), "SPINNER_RESULT", Map.of(
                "speakerId", selectedSpeaker.getId(),
                "speakerName", selectedSpeaker.getDisplayName(),
                "avatarSeed", selectedSpeaker.getAvatarSeed()
        ));

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void submitAnswer(String playerToken, UUID questionId, SubmitAnswerRequest request) {
        Player player = getPlayerByToken(playerToken);
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        QuestionAssignment assignment = questionAssignmentRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new IllegalStateException("Assignment not found for question"));

        if (!assignment.getAssignedPlayerId().equals(player.getId())) {
            throw new IllegalStateException("Only the assigned perspective speaker can answer this question");
        }

        assignment.setAnswerDecision(request.getAnswerDecision());
        if (request.getAnswerDecision() == AnswerDecision.PASSED) {
            assignment.setInitialAnswer("Passed. This story will remain by the fire for now.");
            question.setStatus(QuestionStatus.PASSED);
        } else {
            assignment.setInitialAnswer(request.getInitialAnswer() != null ? request.getInitialAnswer().trim() : "");
            question.setStatus(QuestionStatus.DISCUSSING);
        }
        assignment.setAnsweredAt(Instant.now());
        questionAssignmentRepository.save(assignment);
        questionRepository.save(question);

        Room room = roomRepository.findById(question.getRoomId())
                .orElseThrow(() -> new IllegalStateException("Room not found"));
        room.setGameState(GameState.QUESTION_DISCUSSION);
        roomRepository.save(room);

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void submitGuess(String playerToken, UUID questionId, SubmitGuessRequest request) {
        Player player = getPlayerByToken(playerToken);

        Optional<Guess> existing = guessRepository.findByQuestionIdAndGuessingPlayerId(questionId, player.getId());
        Guess guess;
        if (existing.isPresent()) {
            guess = existing.get();
            if (request.getGuessedAuthorId() != null) guess.setGuessedAuthorId(request.getGuessedAuthorId());
            if (request.getGuessedTargetId() != null) guess.setGuessedTargetId(request.getGuessedTargetId());
        } else {
            guess = new Guess(questionId, player.getId(), request.getGuessedAuthorId(), request.getGuessedTargetId());
        }
        guessRepository.save(guess);

        Room room = roomRepository.findById(player.getRoomId()).orElse(null);
        if (room != null) {
            broadcastRoomUpdate(room.getRoomCode());
        }
    }

    @Transactional
    public void completeDiscussion(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        if (room.getCurrentQuestionId() != null) {
            Optional<QuestionAssignment> qa = questionAssignmentRepository.findByQuestionId(room.getCurrentQuestionId());
            qa.ifPresent(a -> {
                a.setDiscussionCompleted(true);
                questionAssignmentRepository.save(a);
            });
            Optional<Question> q = questionRepository.findById(room.getCurrentQuestionId());
            q.ifPresent(quest -> {
                quest.setStatus(QuestionStatus.DISCUSSED);
                questionRepository.save(quest);
            });
        }

        // Advance to choosing next speaker or check if all complete
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());
        boolean hasRemaining = false;
        for (Question quest : questions) {
            Optional<QuestionAssignment> qa = questionAssignmentRepository.findByQuestionId(quest.getId());
            if (qa.isPresent() && !qa.get().isDiscussionCompleted()) {
                hasRemaining = true;
                break;
            }
        }

        if (hasRemaining) {
            room.setGameState(GameState.CHOOSING_SPEAKER);
            room.setCurrentSpeakerPlayerId(null);
            room.setCurrentQuestionId(null);
        } else {
            room.setGameState(GameState.ALL_QUESTIONS_COMPLETE);
            room.setCurrentSpeakerPlayerId(null);
            room.setCurrentQuestionId(null);
        }
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void startRevealPhase(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());
        if (questions.isEmpty()) {
            throw new IllegalStateException("No questions available for reveal");
        }
        room.setCurrentQuestionIndex(0);
        room.setCurrentQuestionId(questions.get(0).getId());
        room.setGameState(GameState.TARGET_REVEAL);
        roomRepository.save(room);

        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void revealAuthor(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        room.setGameState(GameState.AUTHOR_REVEAL);
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void moveToPerspectiveComparison(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        room.setGameState(GameState.PERSPECTIVE_COMPARISON);
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void submitPerspectiveContext(String playerToken, UUID questionId, SubmitPerspectiveContextRequest request) {
        Player player = getPlayerByToken(playerToken);
        QuestionAssignment assignment = questionAssignmentRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new IllegalStateException("Question assignment not found"));

        if (request.getActualTargetResponse() != null && !request.getActualTargetResponse().trim().isEmpty()) {
            assignment.setActualTargetResponse(request.getActualTargetResponse().trim());
        }
        if (request.getAuthorContext() != null && !request.getAuthorContext().trim().isEmpty()) {
            assignment.setAuthorContext(request.getAuthorContext().trim());
        }
        questionAssignmentRepository.save(assignment);

        Room room = roomRepository.findById(player.getRoomId()).orElse(null);
        if (room != null) {
            broadcastRoomUpdate(room.getRoomCode());
        }
    }

    @Transactional
    public void nextRevealQuestion(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());

        int nextIdx = (room.getCurrentQuestionIndex() != null ? room.getCurrentQuestionIndex() : 0) + 1;
        if (nextIdx < questions.size()) {
            room.setCurrentQuestionIndex(nextIdx);
            room.setCurrentQuestionId(questions.get(nextIdx).getId());
            room.setGameState(GameState.TARGET_REVEAL);
        } else {
            room.setGameState(GameState.SESSION_COMPLETE);
            room.setCurrentQuestionId(null);
        }
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    @Transactional
    public void endSession(String playerToken, String roomCode) {
        Room room = getRoomAndVerifyHost(playerToken, roomCode);
        room.setGameState(GameState.SESSION_COMPLETE);
        roomRepository.save(room);
        broadcastRoomUpdate(room.getRoomCode());
    }

    // =========================================================================
    // VISIBILITY-FILTERED STATE BUILDERS (STRICT SECURITY)
    // =========================================================================

    @Transactional(readOnly = true)
    public RoomStateDto getRoomState(String roomCode, String playerToken) {
        Room room = roomRepository.findByRoomCode(roomCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomCode));

        Player currentPlayer = playerToken != null ? playerRepository.findBySessionToken(playerToken).orElse(null) : null;
        List<Player> players = playerRepository.findByRoomIdOrderByJoinedAtAsc(room.getId());
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());

        Map<UUID, Player> playerMap = players.stream().collect(Collectors.toMap(Player::getId, p -> p));

        RoomStateDto dto = new RoomStateDto();
        dto.setRoomId(room.getId());
        dto.setRoomCode(room.getRoomCode());
        dto.setRoomName(room.getRoomName());
        dto.setTheme(room.getTheme());
        dto.setGameState(room.getGameState());
        dto.setGameMode(room.getGameMode());
        dto.setHostPlayerId(room.getHostPlayerId());
        dto.setMaxPlayers(room.getMaxPlayers());
        dto.setPlayers(players.stream()
                .map(p -> new PlayerDto(p.getId(), p.getDisplayName(), p.getAvatarSeed(), p.isConnected(), p.isDisclaimerAccepted()))
                .toList());

        dto.setTotalQuestions(questions.size());
        dto.setCurrentQuestionIndex(room.getCurrentQuestionIndex() != null ? room.getCurrentQuestionIndex() : 0);
        dto.setCurrentSpeakerPlayerId(room.getCurrentSpeakerPlayerId());
        if (room.getCurrentSpeakerPlayerId() != null && playerMap.containsKey(room.getCurrentSpeakerPlayerId())) {
            dto.setCurrentSpeakerName(playerMap.get(room.getCurrentSpeakerPlayerId()).getDisplayName());
        }

        dto.setDisclaimerAcceptedCount((int) players.stream().filter(Player::isDisclaimerAccepted).count());
        dto.setTotalSubmittedQuestions(questions.size());

        if (currentPlayer != null) {
            boolean hasSubmitted = questions.stream().anyMatch(q -> q.getAuthorPlayerId().equals(currentPlayer.getId()));
            dto.setMyQuestionSubmitted(hasSubmitted);

            if (room.getCurrentQuestionId() != null) {
                boolean hasGuessed = guessRepository.findByQuestionIdAndGuessingPlayerId(room.getCurrentQuestionId(), currentPlayer.getId()).isPresent();
                dto.setMyGuessSubmitted(hasGuessed);
            }

            // Provide player's privately assigned question if assigned
            List<QuestionAssignment> myAssignments = questionAssignmentRepository.findByAssignedPlayerId(currentPlayer.getId());
            if (!myAssignments.isEmpty()) {
                QuestionAssignment myQa = myAssignments.get(0);
                questionRepository.findById(myQa.getQuestionId()).ifPresent(q -> {
                    dto.setMyAssignedQuestion(buildQuestionPublicDto(q, myQa, room.getGameState(), playerMap));
                });
            }
        }

        // Active question
        if (room.getCurrentQuestionId() != null) {
            questionRepository.findById(room.getCurrentQuestionId()).ifPresent(q -> {
                QuestionAssignment qa = questionAssignmentRepository.findByQuestionId(q.getId()).orElse(null);
                dto.setActiveQuestion(buildQuestionPublicDto(q, qa, room.getGameState(), playerMap));
            });
        }

        return dto;
    }

    private QuestionPublicDto buildQuestionPublicDto(Question q, QuestionAssignment qa, GameState gameState, Map<UUID, Player> playerMap) {
        QuestionPublicDto dto = new QuestionPublicDto();
        dto.setId(q.getId());
        dto.setQuestionContent(q.getQuestionContent());
        dto.setSensitive(q.isSensitive());
        dto.setStatus(q.getStatus());

        if (qa != null) {
            dto.setAssignedPlayerId(qa.getAssignedPlayerId());
            if (playerMap.containsKey(qa.getAssignedPlayerId())) {
                dto.setAssignedDisplayName(playerMap.get(qa.getAssignedPlayerId()).getDisplayName());
            }
            dto.setInitialAnswer(qa.getInitialAnswer());
            dto.setAnswerDecision(qa.getAnswerDecision());
            dto.setActualTargetResponse(qa.getActualTargetResponse());
            dto.setAuthorContext(qa.getAuthorContext());
        }

        // STRICT PRIVACY RULES:
        // Target is revealed ONLY during TARGET_REVEAL, AUTHOR_REVEAL, PERSPECTIVE_COMPARISON, SESSION_COMPLETE
        boolean allowTargetReveal = gameState == GameState.TARGET_REVEAL
                || gameState == GameState.AUTHOR_REVEAL
                || gameState == GameState.PERSPECTIVE_COMPARISON
                || gameState == GameState.SESSION_COMPLETE;

        // Author is revealed ONLY during AUTHOR_REVEAL, PERSPECTIVE_COMPARISON, SESSION_COMPLETE
        boolean allowAuthorReveal = gameState == GameState.AUTHOR_REVEAL
                || gameState == GameState.PERSPECTIVE_COMPARISON
                || gameState == GameState.SESSION_COMPLETE;

        dto.setTargetRevealed(allowTargetReveal);
        dto.setAuthorRevealed(allowAuthorReveal);

        if (allowTargetReveal) {
            List<QuestionTarget> targets = questionTargetRepository.findByQuestionId(q.getId());
            if (!targets.isEmpty()) {
                dto.setTargetType(targets.get(0).getTargetType());
                List<UUID> targetIds = targets.stream()
                        .map(QuestionTarget::getTargetPlayerId)
                        .filter(Objects::nonNull)
                        .toList();
                dto.setTargetPlayerIds(targetIds);
                dto.setTargetDisplayNames(targetIds.stream()
                        .map(id -> playerMap.containsKey(id) ? playerMap.get(id).getDisplayName() : "Anonymous")
                        .toList());
            }
        }

        if (allowAuthorReveal) {
            dto.setAuthorPlayerId(q.getAuthorPlayerId());
            if (playerMap.containsKey(q.getAuthorPlayerId())) {
                dto.setAuthorDisplayName(playerMap.get(q.getAuthorPlayerId()).getDisplayName());
            } else {
                dto.setAuthorDisplayName("Anonymous");
            }
        }

        return dto;
    }

    @Transactional(readOnly = true)
    public PerspectiveComparisonDto getPerspectiveComparison(String roomCode, UUID questionId) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));
        QuestionAssignment qa = questionAssignmentRepository.findByQuestionId(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found"));
        List<Player> players = playerRepository.findByRoomIdOrderByJoinedAtAsc(q.getRoomId());
        Map<UUID, Player> playerMap = players.stream().collect(Collectors.toMap(Player::getId, p -> p));

        PerspectiveComparisonDto dto = new PerspectiveComparisonDto();
        dto.setQuestionId(q.getId());
        dto.setQuestionContent(q.getQuestionContent());
        dto.setSensitive(q.isSensitive());

        dto.setInitialInterpreterId(qa.getAssignedPlayerId());
        if (playerMap.containsKey(qa.getAssignedPlayerId())) {
            dto.setInitialInterpreterName(playerMap.get(qa.getAssignedPlayerId()).getDisplayName());
        }
        dto.setInitialAnswer(qa.getInitialAnswer());
        dto.setAnswerDecision(qa.getAnswerDecision());

        dto.setAuthorId(q.getAuthorPlayerId());
        if (playerMap.containsKey(q.getAuthorPlayerId())) {
            dto.setAuthorName(playerMap.get(q.getAuthorPlayerId()).getDisplayName());
        }
        dto.setAuthorContext(qa.getAuthorContext());

        List<QuestionTarget> targets = questionTargetRepository.findByQuestionId(q.getId());
        if (!targets.isEmpty()) {
            dto.setTargetType(targets.get(0).getTargetType());
            List<UUID> targetIds = targets.stream().map(QuestionTarget::getTargetPlayerId).filter(Objects::nonNull).toList();
            dto.setTargetPlayerIds(targetIds);
            dto.setTargetNames(targetIds.stream().map(id -> playerMap.containsKey(id) ? playerMap.get(id).getDisplayName() : "Anonymous").toList());
        }
        dto.setActualTargetResponse(qa.getActualTargetResponse());

        // Guesses stats
        List<Guess> guesses = guessRepository.findByQuestionId(q.getId());
        dto.setTotalGuesses(guesses.size());
        int correctAuthor = 0;
        int correctTarget = 0;
        Set<UUID> targetIdSet = targets.stream().map(QuestionTarget::getTargetPlayerId).filter(Objects::nonNull).collect(Collectors.toSet());

        for (Guess g : guesses) {
            if (g.getGuessedAuthorId() != null && g.getGuessedAuthorId().equals(q.getAuthorPlayerId())) {
                correctAuthor++;
            }
            if (g.getGuessedTargetId() != null && targetIdSet.contains(g.getGuessedTargetId())) {
                correctTarget++;
            }
        }
        dto.setCorrectAuthorGuesses(correctAuthor);
        dto.setCorrectTargetGuesses(correctTarget);

        return dto;
    }

    @Transactional(readOnly = true)
    public SessionSummaryDto getSessionSummary(String roomCode) {
        Room room = roomRepository.findByRoomCode(roomCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomCode));
        List<Question> questions = questionRepository.findByRoomIdOrderByCreatedAtAsc(room.getId());

        SessionSummaryDto summary = new SessionSummaryDto();
        summary.setTotalQuestions(questions.size());

        List<PerspectiveComparisonDto> comparisons = new ArrayList<>();
        int answered = 0;
        int passed = 0;
        int totalGuesses = 0;
        int correctAuthors = 0;
        int correctTargets = 0;

        for (Question q : questions) {
            PerspectiveComparisonDto comp = getPerspectiveComparison(roomCode, q.getId());
            comparisons.add(comp);
            if (comp.getAnswerDecision() == AnswerDecision.PASSED) {
                passed++;
            } else if (comp.getAnswerDecision() == AnswerDecision.ANSWERED) {
                answered++;
            }
            totalGuesses += comp.getTotalGuesses();
            correctAuthors += comp.getCorrectAuthorGuesses();
            correctTargets += comp.getCorrectTargetGuesses();
        }

        summary.setTotalAnswered(answered);
        summary.setTotalPassed(passed);
        summary.setTotalGuessesSubmitted(totalGuesses);
        summary.setCorrectAuthorGuesses(correctAuthors);
        summary.setCorrectTargetGuesses(correctTargets);
        summary.setComparisons(comparisons);

        return summary;
    }

    public Player getPlayerByToken(String sessionToken) {
        if (sessionToken == null || sessionToken.isBlank()) {
            throw new IllegalArgumentException("Session token is missing");
        }
        return playerRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session token"));
    }

    public Room getRoomAndVerifyHost(String playerToken, String roomCode) {
        Player player = getPlayerByToken(playerToken);
        Room room = roomRepository.findByRoomCode(roomCode.trim().toUpperCase())
                .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomCode));
        if (!room.getHostPlayerId().equals(player.getId())) {
            throw new IllegalStateException("Only the campfire host can perform this action");
        }
        return room;
    }

    public void broadcastRoomUpdate(String roomCode) {
        try {
            RoomStateDto state = getRoomState(roomCode, null);
            gameNotifier.notifyRoom(roomCode, state);
        } catch (Exception e) {
            log.error("Failed to broadcast room update for {}", roomCode, e);
        }
    }
}
