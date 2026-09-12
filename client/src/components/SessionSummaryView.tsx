import React, { useState, useEffect } from 'react';
import { SessionSummary } from '../types/game';
import { api } from '../services/api';
import { Flame, BookOpen, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionSummaryViewProps {
  roomCode: string;
  onLeave: () => void;
}

export const SessionSummaryView: React.FC<SessionSummaryViewProps> = ({ roomCode, onLeave }) => {
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    loadSummary();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FF5722', '#FF7A00', '#FFB703', '#E63946'],
    });
  }, []);

  const loadSummary = async () => {
    try {
      const res = await api.getSessionSummary(roomCode);
      setSummary(res);
    } catch (e) {
      console.error(e);
    }
  };

  if (!summary) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-xs text-campfire-muted">
        Gathering the embers...
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 text-center space-y-6">
      {/* Campfire Crown Icon */}
      <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-campfire-flame to-campfire-gold flex items-center justify-center shadow-flame animate-pulse">
        <Flame className="w-9 h-9 text-slate-950" />
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-campfire-gold via-campfire-flame to-campfire-ember uppercase fire-text-glow">
          The Fire Remembers
        </h1>
        <p className="text-xs text-campfire-muted mt-1">
          Every perspective has been shared around this circle.
        </p>
      </div>

      {/* Poetic Campfire Conclusion Card */}
      <div className="campfire-card-glow rounded-3xl p-6 text-center space-y-3">
        <blockquote className="text-lg sm:text-xl font-display font-bold text-white fire-text-glow leading-relaxed">
          &ldquo;{summary.closingMessage}&rdquo;
        </blockquote>
        <p className="text-xs text-campfire-muted max-w-xs mx-auto">
          Friendships aren&apos;t built on having the exact same version of every memory — they are built on sitting down together and hearing each other out.
        </p>
      </div>

      {/* Session Numbers (No Winners, Pure Chronicle) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/60 text-center">
          <div className="text-2xl font-black text-campfire-gold">{summary.totalQuestions}</div>
          <div className="text-xs text-slate-300 font-medium">Stories Unfolded</div>
          <div className="text-[10px] text-campfire-muted mt-1">{summary.totalAnswered} interpreted</div>
        </div>

        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/60 text-center">
          <div className="text-2xl font-black text-campfire-flame">{summary.totalGuessesSubmitted}</div>
          <div className="text-xs text-slate-300 font-medium">Secret Guesses</div>
          <div className="text-[10px] text-campfire-muted mt-1">
            {summary.correctAuthorGuesses + summary.correctTargetGuesses} assumptions spot-on
          </div>
        </div>
      </div>

      {/* Stories Revisited Chronicle */}
      <div className="text-left space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-campfire-muted flex items-center gap-1.5 px-1">
          <BookOpen className="w-3.5 h-3.5 text-campfire-gold" />
          <span>Shared Lore Chronicle</span>
        </h3>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {summary.comparisons.map((comp, idx) => (
            <div
              key={comp.questionId || idx}
              className="p-3.5 bg-campfire-card/90 border border-campfire-border/60 rounded-2xl space-y-1.5"
            >
              <div className="text-xs font-medium text-white line-clamp-2">
                &ldquo;{comp.questionContent}&rdquo;
              </div>
              <div className="flex flex-wrap gap-2 text-[11px] text-campfire-muted pt-1 border-t border-campfire-border/30">
                <span>
                  Author: <strong className="text-slate-200">{comp.authorName || 'Anonymous'}</strong>
                </span>
                <span>•</span>
                <span>
                  Target: <strong className="text-campfire-gold">{comp.targetNames?.join(', ') || 'Everyone'}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onLeave}
        className="w-full py-4 bg-campfire-card border border-campfire-flame/40 hover:border-campfire-flame rounded-2xl text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4 text-campfire-flame" />
        <span>Return to Campfire Entrance</span>
      </button>
    </div>
  );
};
