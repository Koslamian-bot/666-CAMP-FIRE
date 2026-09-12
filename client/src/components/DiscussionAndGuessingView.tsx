import React, { useState } from 'react';
import { QuestionPublic, Player } from '../types/game';
import { MessageSquare, HelpCircle, Check, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DiscussionAndGuessingViewProps {
  question: QuestionPublic;
  players: Player[];
  currentPlayerId: string;
  isHost: boolean;
  myGuessSubmitted: boolean;
  onSubmitGuess: (guessedAuthorId?: string, guessedTargetId?: string) => Promise<void>;
  onCompleteDiscussion: () => void;
}

export const DiscussionAndGuessingView: React.FC<DiscussionAndGuessingViewProps> = ({
  question,
  players,
  currentPlayerId,
  isHost,
  myGuessSubmitted,
  onSubmitGuess,
  onCompleteDiscussion,
}) => {
  const [guessedAuthorId, setGuessedAuthorId] = useState<string>('');
  const [guessedTargetId, setGuessedTargetId] = useState<string>('');
  const [submitted, setSubmitted] = useState(myGuessSubmitted);
  const [loading, setLoading] = useState(false);

  const eligibleAuthors = players.filter((p) => p.id !== currentPlayerId);
  const eligibleTargets = players;

  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessedAuthorId && !guessedTargetId) return;

    try {
      setLoading(true);
      sounds.playSpark();
      await onSubmitGuess(guessedAuthorId || undefined, guessedTargetId || undefined);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campfire-card border border-campfire-border/70 text-xs text-campfire-gold mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-campfire-flame" />
          <span>Room Discussion</span>
        </div>
        <h2 className="text-2xl font-display font-black text-white tracking-wide uppercase fire-text-glow">
          What Do You Think?
        </h2>
        <p className="text-xs text-campfire-muted mt-1">
          Discuss openly around the fire. Who do you think wrote this, and who was it really meant for?
        </p>
      </div>

      {/* Question & Perspective Answer Card */}
      <div className="campfire-card-glow rounded-3xl p-5 sm:p-6 mb-5 space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-campfire-muted">The Question</span>
          <blockquote className="text-base sm:text-lg font-display font-medium text-white mt-1">
            &ldquo;{question.questionContent}&rdquo;
          </blockquote>
        </div>

        <div className="p-3.5 bg-campfire-darkest/80 border border-campfire-border/60 rounded-2xl">
          <div className="flex items-center justify-between text-[11px] text-campfire-gold font-bold mb-1.5">
            <span>{question.assignedDisplayName}&apos;s POV:</span>
            <span className="text-[10px] font-normal text-campfire-muted lowercase">shuffled interpreter</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 italic">
            &ldquo;{question.initialAnswer || 'Shared their thoughts aloud with the circle.'}&rdquo;
          </p>
        </div>
      </div>

      {/* Anonymous Guessing Card */}
      <div className="campfire-card rounded-3xl p-5 sm:p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-campfire-flame" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Cast Anonymous Guesses
          </h3>
        </div>
        <p className="text-xs text-campfire-muted mb-4">
          Guesses remain private and will be compared during the grand reveal!
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>Your secret guesses are locked into the fire!</span>
          </div>
        ) : (
          <form onSubmit={handleGuessSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Who actually wrote this question?
              </label>
              <select
                value={guessedAuthorId}
                onChange={(e) => setGuessedAuthorId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-campfire-darkest border border-campfire-border rounded-xl text-xs text-slate-200 focus:border-campfire-flame focus:outline-none"
              >
                <option value="">Select suspected author...</option>
                {eligibleAuthors.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Who was this actually intended for?
              </label>
              <select
                value={guessedTargetId}
                onChange={(e) => setGuessedTargetId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-campfire-darkest border border-campfire-border rounded-xl text-xs text-slate-200 focus:border-campfire-flame focus:outline-none"
              >
                <option value="">Select suspected target...</option>
                {eligibleTargets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || (!guessedAuthorId && !guessedTargetId)}
              className="w-full py-3 bg-campfire-card border border-campfire-flame/50 hover:bg-campfire-flame hover:text-slate-950 rounded-xl text-xs font-bold text-campfire-gold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Lock In My Guesses</span>
            </button>
          </form>
        )}
      </div>

      {/* Host Controls: Next Question */}
      {isHost ? (
        <button
          onClick={onCompleteDiscussion}
          className="w-full btn-fire-primary text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide text-sm shadow-flame active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Conclude Discussion &amp; Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="text-center py-2.5 px-4 bg-campfire-card/60 border border-campfire-border/40 rounded-2xl text-xs text-campfire-muted flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-campfire-gold" />
          <span>Discussing freely around the fire. The host will advance when ready.</span>
        </div>
      )}
    </div>
  );
};
