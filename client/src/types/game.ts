export type GameState =
  | 'LOBBY'
  | 'DISCLAIMER'
  | 'QUESTION_SUBMISSION'
  | 'SUBMISSION_LOCKED'
  | 'QUESTION_SHUFFLING'
  | 'CHOOSING_SPEAKER'
  | 'QUESTION_ANSWERING'
  | 'QUESTION_DISCUSSION'
  | 'ALL_QUESTIONS_COMPLETE'
  | 'TARGET_REVEAL'
  | 'AUTHOR_REVEAL'
  | 'PERSPECTIVE_COMPARISON'
  | 'SESSION_COMPLETE';

export type GameMode = 'DIGITAL_SPINNER' | 'PHYSICAL_BOTTLE';

export type AnswerDecision = 'PENDING' | 'ANSWERED' | 'LATER' | 'PASSED';

export type TargetType = 'SINGLE' | 'MULTIPLE' | 'EVERYONE';

export interface Player {
  id: string;
  displayName: string;
  avatarSeed: string;
  isConnected: boolean;
  disclaimerAccepted: boolean;
}

export interface PlayerSession {
  token: string;
  playerId: string;
  roomId: string;
  roomCode: string;
  displayName: string;
  avatarSeed: string;
  isHost: boolean;
}

export interface QuestionPublic {
  id: string;
  questionContent: string;
  isSensitive: boolean;
  status: string;
  assignedPlayerId?: string;
  assignedDisplayName?: string;
  initialAnswer?: string;
  answerDecision?: AnswerDecision;
  isTargetRevealed: boolean;
  targetType?: TargetType;
  targetPlayerIds?: string[];
  targetDisplayNames?: string[];
  isAuthorRevealed: boolean;
  authorPlayerId?: string;
  authorDisplayName?: string;
  actualTargetResponse?: string;
  authorContext?: string;
}

export interface RoomState {
  roomId: string;
  roomCode: string;
  roomName: string;
  theme?: string;
  gameState: GameState;
  gameMode: GameMode;
  hostPlayerId: string;
  maxPlayers: number;
  players: Player[];
  currentQuestionIndex: number;
  totalQuestions: number;
  currentSpeakerPlayerId?: string;
  currentSpeakerName?: string;
  activeQuestion?: QuestionPublic;
  myAssignedQuestion?: QuestionPublic;
  disclaimerAcceptedCount: number;
  totalSubmittedQuestions: number;
  myQuestionSubmitted: boolean;
  myGuessSubmitted: boolean;
}

export interface PerspectiveComparison {
  questionId: string;
  questionContent: string;
  isSensitive: boolean;
  initialInterpreterId?: string;
  initialInterpreterName?: string;
  initialAnswer?: string;
  answerDecision?: AnswerDecision;
  targetType?: TargetType;
  targetPlayerIds?: string[];
  targetNames?: string[];
  actualTargetResponse?: string;
  authorId?: string;
  authorName?: string;
  authorContext?: string;
  totalGuesses: number;
  correctAuthorGuesses: number;
  correctTargetGuesses: number;
}

export interface SessionSummary {
  totalQuestions: number;
  totalAnswered: number;
  totalPassed: number;
  totalGuessesSubmitted: number;
  correctAuthorGuesses: number;
  correctTargetGuesses: number;
  comparisons: PerspectiveComparison[];
  closingMessage: string;
}
