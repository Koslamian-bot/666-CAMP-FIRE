import {
  PlayerSession,
  RoomState,
  PerspectiveComparison,
  SessionSummary,
  AnswerDecision,
  TargetType,
  GameMode,
} from '../types/game';

const API_BASE = import.meta.env.VITE_API_URL || '';

function getHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Player-Token'] = token;
  }
  return headers;
}

export const api = {
  // Session storage helpers
  saveSession(session: PlayerSession) {
    localStorage.setItem('campfire_session', JSON.stringify(session));
  },

  getSession(): PlayerSession | null {
    const raw = localStorage.getItem('campfire_session');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearSession() {
    localStorage.removeItem('campfire_session');
  },

  // Room lifecycle
  async createRoom(data: {
    roomName: string;
    theme?: string;
    maxPlayers?: number;
    password?: string;
    gameMode?: GameMode;
    hostDisplayName: string;
    hostAvatarSeed?: string;
  }): Promise<PlayerSession> {
    const res = await fetch(`${API_BASE}/api/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create room' }));
      throw new Error(err.error || 'Failed to create room');
    }
    const session = await res.json();
    this.saveSession(session);
    return session;
  },

  async joinRoom(data: {
    roomCode: string;
    displayName: string;
    avatarSeed?: string;
    password?: string;
  }): Promise<PlayerSession> {
    const res = await fetch(`${API_BASE}/api/rooms/join`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to join campfire' }));
      throw new Error(err.error || 'Failed to join campfire');
    }
    const session = await res.json();
    this.saveSession(session);
    return session;
  },

  async getRoomState(roomCode: string, token?: string): Promise<RoomState> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to fetch room state' }));
      throw new Error(err.error || 'Failed to fetch room state');
    }
    return res.json();
  },

  async startDisclaimer(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/start-disclaimer`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to start disclaimer');
  },

  async acceptDisclaimer(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/disclaimer`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to accept disclaimer');
  },

  async submitQuestion(
    roomCode: string,
    token: string,
    data: {
      questionContent: string;
      isSensitive?: boolean;
      targetType?: TargetType;
      targetPlayerIds?: string[];
    }
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/questions`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to submit question' }));
      throw new Error(err.error || 'Failed to submit question');
    }
  },

  async lockSubmissions(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/lock-submission`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to lock submissions');
  },

  async shuffle(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/shuffle`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to shuffle questions');
  },

  async spin(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/spin`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to spin campfire');
  },

  async submitAnswer(
    questionId: string,
    token: string,
    data: {
      answerDecision: AnswerDecision;
      initialAnswer?: string;
    }
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/api/questions/${questionId}/answer`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit answer');
  },

  async submitGuess(
    questionId: string,
    token: string,
    data: {
      guessedAuthorId?: string;
      guessedTargetId?: string;
    }
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/api/questions/${questionId}/guess`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit guess');
  },

  async completeDiscussion(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/complete-discussion`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to complete discussion');
  },

  async startReveal(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/start-reveal`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to start reveal');
  },

  async revealAuthor(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/reveal-author`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to reveal author');
  },

  async moveToPerspectiveComparison(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/perspective-comparison`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to open perspective comparison');
  },

  async submitPerspectiveContext(
    questionId: string,
    token: string,
    data: {
      actualTargetResponse?: string;
      authorContext?: string;
    }
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/api/questions/${questionId}/perspective-context`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit context');
  },

  async nextReveal(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/next-reveal`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to advance reveal');
  },

  async endSession(roomCode: string, token: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/end-session`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to end campfire session');
  },

  async getPerspectiveComparison(roomCode: string, questionId: string): Promise<PerspectiveComparison> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/perspective/${questionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch comparison');
    return res.json();
  },

  async getSessionSummary(roomCode: string): Promise<SessionSummary> {
    const res = await fetch(`${API_BASE}/api/rooms/${roomCode}/summary`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch session summary');
    return res.json();
  },
};
