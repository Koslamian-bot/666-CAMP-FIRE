import React from 'react';
import { QuestionPublic } from '../types/game';
import { Eye, ArrowRight, Sparkles, User, Users } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LoreRevealViewProps {
  question: QuestionPublic;
  currentIndex: number;
  totalQuestions: number;
  isHost: boolean;
  gameState: string;
  onRevealAuthor: () => void;
  onAdvanceToComparison: () => void;
}

export const LoreRevealView: React.FC<LoreRevealViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  isHost,
  onRevealAuthor,
  onAdvanceToComparison,
}) => {
  const isAuthorRevealed = question.isAuthorRevealed;

  const handleRevealAuthor = () => {
    sounds.playReveal();
    onRevealAuthor();
  };

  const handleAdvance = () => {
    sounds.playFlameFlare();
    onAdvanceToComparison();
  };

  const targetsFormatted = question.targetDisplayNames && question.targetDisplayNames.length > 0
    ? question.targetDisplayNames.join(', ')
    : question.targetType === 'EVERYONE'
    ? 'Everyone in the Room'
    : 'Unknown';

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4 text-center">
      {/* Cinematic Banner */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-campfire-card border border-campfire-flame/40 text-xs text-campfire-gold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-campfire-flame" />
        <span>Lore Chronicle: Story {currentIndex + 1} of {totalQuestions}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-campfire-gold via-campfire-flame to-campfire-ember mb-2 uppercase fire-text-glow">
        The Fire Reveals
      </h1>
      <p className="text-xs text-campfire-muted mb-6">
        Let us see who was really meant to hear this, and who whispered it.
      </p>

      {/* Main Revelation Box */}
      <div className="campfire-card-glow rounded-3xl p-6 sm:p-7 mb-6 text-left space-y-6">
        {/* The Question */}
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-campfire-muted block mb-1">
            Original Secret
          </span>
          <blockquote className="text-lg sm:text-xl font-display font-medium text-white leading-relaxed">
            &ldquo;{question.questionContent}&rdquo;
          </blockquote>
        </div>

        {/* Shuffled Interpreter Recall */}
        <div className="p-3 bg-campfire-darkest/60 border border-campfire-border/50 rounded-2xl flex items-center justify-between text-xs">
          <span className="text-campfire-muted">Initially interpreted by:</span>
          <span className="font-bold text-slate-200">{question.assignedDisplayName}</span>
        </div>

        {/* Level 1: Intended Recipient */}
        <div className="pt-2 border-t border-campfire-border/40">
          <span className="text-[11px] uppercase tracking-wider font-bold text-campfire-gold flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-campfire-flame" />
            <span>Actually Meant For:</span>
          </span>

          <div className="p-4 bg-gradient-to-r from-campfire-flame/20 via-campfire-gold/10 to-transparent border border-campfire-flame/40 rounded-2xl animate-pulse">
            <div className="text-xl sm:text-2xl font-display font-black text-white fire-text-glow uppercase">
              🔥 {targetsFormatted}
            </div>
            <div className="text-xs text-campfire-muted mt-1 italic">
              Did the room guess this person? Pause and talk about it!
            </div>
          </div>
        </div>

        {/* Level 2: The Author */}
        <div className="pt-2 border-t border-campfire-border/40">
          <span className="text-[11px] uppercase tracking-wider font-bold text-campfire-gold flex items-center gap-1.5 mb-2">
            <User className="w-3.5 h-3.5 text-campfire-flame" />
            <span>Written By:</span>
          </span>

          {isAuthorRevealed ? (
            <div className="p-4 bg-gradient-to-r from-campfire-flame/30 via-campfire-ember/20 to-transparent border border-campfire-flame rounded-2xl">
              <div className="text-xl sm:text-2xl font-display font-black text-white fire-text-glow-lg uppercase">
                🔥 {question.authorDisplayName || 'Anonymous'}
              </div>
              <div className="text-xs text-campfire-muted mt-1 italic">
                The circle now knows the full context!
              </div>
            </div>
          ) : (
            <div className="p-4 bg-campfire-darkest/90 border border-dashed border-campfire-border rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-24 h-5 rounded mystery-shimmer" />
                <span className="text-xs text-campfire-muted italic">Hidden behind smoke</span>
              </div>

              {isHost ? (
                <button
                  onClick={handleRevealAuthor}
                  className="px-4 py-2 btn-fire-primary text-white text-xs font-bold rounded-xl shadow-flame active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Author</span>
                </button>
              ) : (
                <span className="text-xs text-campfire-muted">Waiting for host...</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Host Progression: Move to Perspective Comparison */}
      {isHost && isAuthorRevealed && (
        <button
          onClick={handleAdvance}
          className="w-full btn-fire-primary text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-sm shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Compare Perspectives &amp; Lore</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
