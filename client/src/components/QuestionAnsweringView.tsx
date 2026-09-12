import React, { useState } from 'react';
import { QuestionPublic, AnswerDecision } from '../types/game';
import { Flame, Lock, Volume2, CheckCircle2, Clock, XCircle, ShieldAlert } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestionAnsweringViewProps {
  question: QuestionPublic;
  currentSpeakerName: string;
  isCurrentSpeaker: boolean;
  onSubmitAnswer: (decision: AnswerDecision, answerText?: string) => Promise<void>;
}

export const QuestionAnsweringView: React.FC<QuestionAnsweringViewProps> = ({
  question,
  currentSpeakerName,
  isCurrentSpeaker,
  onSubmitAnswer,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealedToSpeaker, setRevealedToSpeaker] = useState(false);

  const handleDecision = async (decision: AnswerDecision) => {
    try {
      setLoading(true);
      sounds.playSpark();
      await onSubmitAnswer(decision, answerText.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campfire-card border border-campfire-border/70 text-xs text-campfire-gold mb-2">
          <Flame className="w-3.5 h-3.5 text-campfire-flame" />
          <span>The Fire has Chosen</span>
        </div>
        <h2 className="text-2xl font-display font-black text-white tracking-wide uppercase fire-text-glow">
          {currentSpeakerName} is Speaking
        </h2>
        <p className="text-xs text-campfire-muted mt-1">
          {isCurrentSpeaker
            ? 'Read this question aloud to the room and share your perspective.'
            : `${currentSpeakerName} is unlocking their assigned question.`}
        </p>
      </div>

      {/* Question Card */}
      <div className="campfire-card-glow rounded-3xl p-6 sm:p-7 mb-6 relative overflow-hidden">
        {/* Sensitive badge if applicable */}
        {question.isSensitive && (
          <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sensitive topic</span>
          </div>
        )}

        {isCurrentSpeaker ? (
          <div>
            {!revealedToSpeaker ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center text-campfire-flame shadow-flame">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your Assigned Question</h3>
                  <p className="text-xs text-campfire-muted max-w-xs mx-auto mt-1">
                    This question may or may not have been written for you. Answer from your own perspective!
                  </p>
                </div>
                <button
                  onClick={() => {
                    sounds.playReveal();
                    setRevealedToSpeaker(true);
                  }}
                  className="btn-fire-primary text-white py-3 px-6 rounded-2xl font-bold text-sm shadow-flame active:scale-95 transition-all"
                >
                  Unlock &amp; Read Aloud
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-campfire-darkest/90 border border-campfire-flame/30 rounded-2xl">
                  <div className="flex items-center justify-between text-[11px] text-campfire-muted uppercase font-bold tracking-wider mb-2">
                    <span className="flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5 text-campfire-gold" />
                      <span>Read aloud to everyone:</span>
                    </span>
                  </div>
                  <blockquote className="text-lg sm:text-xl font-display font-medium text-white leading-relaxed">
                    &ldquo;{question.questionContent}&rdquo;
                  </blockquote>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Your POV &amp; Interpretation
                  </label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="How do you see this? What is your side or interpretation of this question?"
                    rows={3}
                    className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-2xl text-slate-100 placeholder:text-campfire-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-campfire-flame transition-all resize-none"
                  />
                </div>

                {/* Perspective Decisions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleDecision('ANSWERED')}
                    disabled={loading || !answerText.trim()}
                    className="w-full btn-fire-primary disabled:opacity-40 text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-flame active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>🟢 Answer &amp; Open for Discussion</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleDecision('LATER')}
                      disabled={loading}
                      className="py-2.5 px-3 bg-campfire-card border border-campfire-border rounded-xl text-xs font-bold text-amber-300 hover:border-amber-400 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>🟡 Answer Later</span>
                    </button>

                    <button
                      onClick={() => handleDecision('PASSED')}
                      disabled={loading}
                      className="py-2.5 px-3 bg-campfire-card border border-campfire-border rounded-xl text-xs font-bold text-rose-300 hover:border-rose-400 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>🔴 Pass</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Audience View */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-campfire-flame/20 border border-campfire-flame/40 flex items-center justify-center text-campfire-flame animate-pulse">
              <Volume2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                Listen to {currentSpeakerName}
              </h3>
              <p className="text-xs text-campfire-muted max-w-xs mx-auto">
                {currentSpeakerName} is reading their assigned question aloud and sharing their perspective.
              </p>
            </div>
            <div className="p-4 bg-campfire-darkest/70 border border-campfire-border/50 rounded-2xl text-xs text-slate-300 italic">
              &ldquo;The fire assigns questions randomly. How they interpret it may surprise you.&rdquo;
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
