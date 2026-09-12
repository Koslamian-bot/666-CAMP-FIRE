import React, { useState, useEffect } from 'react';
import { RoomState, PlayerSession, AnswerDecision, GameMode } from './types/game';
import { api } from './services/api';
import { campfireWs } from './services/websocket';
import { EmbersCanvas } from './components/EmbersCanvas';
import { LandingView } from './components/LandingView';
import { LobbyCircle } from './components/LobbyCircle';
import { DisclaimerCard } from './components/DisclaimerCard';
import { QuestionComposer } from './components/QuestionComposer';
import { CampfireSpinner } from './components/CampfireSpinner';
import { QuestionAnsweringView } from './components/QuestionAnsweringView';
import { DiscussionAndGuessingView } from './components/DiscussionAndGuessingView';
import { LoreRevealView } from './components/LoreRevealView';
import { PerspectiveComparisonView } from './components/PerspectiveComparisonView';
import { SessionSummaryView } from './components/SessionSummaryView';

export const App: React.FC = () => {
  const [session, setSession] = useState<PlayerSession | null>(api.getSession());
  const [roomState, setRoomState] = useState<RoomState | null>(null);

  // Read URL params for ?join=CODE
  const [initialJoinCode, setInitialJoinCode] = useState<string>('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      setInitialJoinCode(joinCode.toUpperCase());
    }
  }, []);

  // Sync state and connect WebSocket whenever session changes
  useEffect(() => {
    if (!session) {
      setRoomState(null);
      campfireWs.disconnect();
      return;
    }

    const fetchState = async () => {
      try {
        const state = await api.getRoomState(session.roomCode, session.token);
        setRoomState(state);
      } catch (e) {
        console.error('Failed to sync room state', e);
      }
    };

    fetchState();
    campfireWs.connect(session.roomCode);

    const unsubState = campfireWs.onStateChange((newState) => {
      setRoomState(newState);
    });

    return () => {
      unsubState();
    };
  }, [session?.roomCode, session?.token]);

  // Handle Room Creation
  const handleCreateRoom = async (data: {
    roomName: string;
    theme?: string;
    maxPlayers?: number;
    gameMode: GameMode;
    hostDisplayName: string;
    hostAvatarSeed: string;
  }) => {
    const newSession = await api.createRoom(data);
    setSession(newSession);
  };

  // Handle Room Join
  const handleJoinRoom = async (data: {
    roomCode: string;
    displayName: string;
    avatarSeed: string;
  }) => {
    const newSession = await api.joinRoom(data);
    setSession(newSession);
  };

  // Handle Leave / End
  const handleLeaveSession = () => {
    api.clearSession();
    setSession(null);
    setRoomState(null);
  };

  const currentPlayer = roomState?.players.find((p) => p.id === session?.playerId);
  const isHost = session?.isHost || (roomState && session ? roomState.hostPlayerId === session.playerId : false);

  return (
    <div className="min-h-screen bg-campfire-darkest text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-campfire-flame selection:text-white">
      {/* Background Living Embers */}
      <EmbersCanvas />

      {/* Main Container */}
      <main className="flex-1 flex flex-col relative z-10">
        {!session || !roomState ? (
          <LandingView
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            initialJoinCode={initialJoinCode}
          />
        ) : (
          <>
            {/* Phase 1: LOBBY */}
            {roomState.gameState === 'LOBBY' && (
              <LobbyCircle
                roomCode={roomState.roomCode}
                roomName={roomState.roomName}
                theme={roomState.theme}
                players={roomState.players}
                maxPlayers={roomState.maxPlayers}
                isHost={isHost}
                gameMode={roomState.gameMode}
                onStartDisclaimer={async () => {
                  if (session) await api.startDisclaimer(roomState.roomCode, session.token);
                }}
              />
            )}

            {/* Phase 2: DISCLAIMER */}
            {roomState.gameState === 'DISCLAIMER' && (
              <DisclaimerCard
                isAccepted={currentPlayer?.disclaimerAccepted || false}
                acceptedCount={roomState.disclaimerAcceptedCount}
                totalPlayers={roomState.players.length}
                onAccept={async () => {
                  if (session) await api.acceptDisclaimer(roomState.roomCode, session.token);
                }}
              />
            )}

            {/* Phase 3: QUESTION_SUBMISSION / SUBMISSION_LOCKED */}
            {(roomState.gameState === 'QUESTION_SUBMISSION' || roomState.gameState === 'SUBMISSION_LOCKED') && (
              <QuestionComposer
                players={roomState.players}
                currentPlayerId={session.playerId}
                isHost={isHost}
                totalQuestions={roomState.totalSubmittedQuestions}
                mySubmitted={roomState.myQuestionSubmitted}
                onSubmitQuestion={async (data) => {
                  if (session) await api.submitQuestion(roomState.roomCode, session.token, data);
                }}
                onLockSubmissions={async () => {
                  if (session) await api.lockSubmissions(roomState.roomCode, session.token);
                }}
                onShuffleAndStart={async () => {
                  if (session) await api.shuffle(roomState.roomCode, session.token);
                }}
              />
            )}

            {/* Phase 4: CHOOSING_SPEAKER / SPINNER */}
            {roomState.gameState === 'CHOOSING_SPEAKER' && (
              <CampfireSpinner
                players={roomState.players}
                chosenSpeakerId={roomState.currentSpeakerPlayerId}
                chosenSpeakerName={roomState.currentSpeakerName}
                isHost={isHost}
                gameMode={roomState.gameMode}
                onTriggerSpin={async () => {
                  if (session) await api.spin(roomState.roomCode, session.token);
                }}
                onProceedToAnswer={async () => {
                  // State already transitions to QUESTION_ANSWERING upon spin selection
                }}
              />
            )}

            {/* Phase 5: QUESTION_ANSWERING */}
            {roomState.gameState === 'QUESTION_ANSWERING' && roomState.activeQuestion && (
              <QuestionAnsweringView
                question={roomState.activeQuestion}
                currentSpeakerName={roomState.currentSpeakerName || 'Selected Speaker'}
                isCurrentSpeaker={roomState.currentSpeakerPlayerId === session.playerId}
                onSubmitAnswer={async (decision: AnswerDecision, answerText?: string) => {
                  if (session && roomState.activeQuestion) {
                    await api.submitAnswer(roomState.activeQuestion.id, session.token, {
                      answerDecision: decision,
                      initialAnswer: answerText,
                    });
                  }
                }}
              />
            )}

            {/* Phase 6: QUESTION_DISCUSSION & GUESSING */}
            {roomState.gameState === 'QUESTION_DISCUSSION' && roomState.activeQuestion && (
              <DiscussionAndGuessingView
                question={roomState.activeQuestion}
                players={roomState.players}
                currentPlayerId={session.playerId}
                isHost={isHost}
                myGuessSubmitted={roomState.myGuessSubmitted}
                onSubmitGuess={async (guessedAuthorId, guessedTargetId) => {
                  if (session && roomState.activeQuestion) {
                    await api.submitGuess(roomState.activeQuestion.id, session.token, {
                      guessedAuthorId,
                      guessedTargetId,
                    });
                  }
                }}
                onCompleteDiscussion={async () => {
                  if (session) {
                    await api.completeDiscussion(roomState.roomCode, session.token);
                  }
                }}
              />
            )}

            {/* Phase 7: ALL_QUESTIONS_COMPLETE -> TRANSITION TO LORE REVEAL */}
            {roomState.gameState === 'ALL_QUESTIONS_COMPLETE' && (
              <div className="max-w-md mx-auto w-full px-4 py-12 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-campfire-flame/20 border border-campfire-flame flex items-center justify-center text-campfire-gold animate-bounce">
                  🔥
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase fire-text-glow">
                  All Stories Discussed
                </h2>
                <p className="text-xs text-campfire-muted max-w-xs mx-auto">
                  Every perspective has been heard. The campfire will now unveil who whispered each secret and who it was really meant for.
                </p>
                {isHost ? (
                  <button
                    onClick={async () => {
                      if (session) await api.startReveal(roomState.roomCode, session.token);
                    }}
                    className="w-full btn-fire-primary text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-sm shadow-flame active:scale-95 transition-all"
                  >
                    Unveil the Grand Lore Reveal
                  </button>
                ) : (
                  <div className="text-xs text-campfire-muted italic">
                    Waiting for the host to summon the grand reveal...
                  </div>
                )}
              </div>
            )}

            {/* Phase 8: TARGET_REVEAL & AUTHOR_REVEAL */}
            {(roomState.gameState === 'TARGET_REVEAL' || roomState.gameState === 'AUTHOR_REVEAL') && roomState.activeQuestion && (
              <LoreRevealView
                question={roomState.activeQuestion}
                currentIndex={roomState.currentQuestionIndex}
                totalQuestions={roomState.totalQuestions}
                isHost={isHost}
                gameState={roomState.gameState}
                onRevealAuthor={async () => {
                  if (session) await api.revealAuthor(roomState.roomCode, session.token);
                }}
                onAdvanceToComparison={async () => {
                  if (session) await api.moveToPerspectiveComparison(roomState.roomCode, session.token);
                }}
              />
            )}

            {/* Phase 9: PERSPECTIVE_COMPARISON */}
            {roomState.gameState === 'PERSPECTIVE_COMPARISON' && roomState.activeQuestion && (
              <PerspectiveComparisonView
                roomCode={roomState.roomCode}
                questionId={roomState.activeQuestion.id}
                token={session.token}
                currentPlayerId={session.playerId}
                isHost={isHost}
                currentIndex={roomState.currentQuestionIndex}
                totalQuestions={roomState.totalQuestions}
                onNextStory={async () => {
                  if (session) await api.nextReveal(roomState.roomCode, session.token);
                }}
              />
            )}

            {/* Phase 10: SESSION_COMPLETE */}
            {roomState.gameState === 'SESSION_COMPLETE' && (
              <SessionSummaryView
                roomCode={roomState.roomCode}
                onLeave={handleLeaveSession}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
