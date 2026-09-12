import React, { useState, useEffect } from 'react';
import { PerspectiveComparison } from '../types/game';
import { api } from '../services/api';
import { UserCheck, ArrowRight, BookOpen, Send } from 'lucide-react';
import { sounds } from '../utils/audio';

interface PerspectiveComparisonViewProps {
  roomCode: string;
  questionId: string;
  token: string;
  currentPlayerId: string;
  isHost: boolean;
  currentIndex: number;
  totalQuestions: number;
  onNextStory: () => void;
}

export const PerspectiveComparisonView: React.FC<PerspectiveComparisonViewProps> = ({
  roomCode,
  questionId,
  token,
  currentPlayerId,
  isHost,
  currentIndex,
  totalQuestions,
  onNextStory,
}) => {
  const [data, setData] = useState<PerspectiveComparison | null>(null);
  const [targetNote, setTargetNote] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    loadComparison();
  }, [questionId]);

  const loadComparison = async () => {
    try {
      const res = await api.getPerspectiveComparison(roomCode, questionId);
      setData(res);
      if (res.actualTargetResponse) setTargetNote(res.actualTargetResponse);
      if (res.authorContext) setAuthorNote(res.authorContext);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveContext = async () => {
    try {
      setSubmittingNote(true);
      sounds.playSpark();
      await api.submitPerspectiveContext(questionId, token, {
        actualTargetResponse: targetNote.trim(),
        authorContext: authorNote.trim(),
      });
      await loadComparison();
    } finally {
      setSubmittingNote(false);
    }
  };

  if (!data) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-xs text-campfire-muted">
        Consulting the ashes...
      </div>
    );
  }

  const isAuthor = data.authorId === currentPlayerId;
  const isTarget = data.targetPlayerIds?.includes(currentPlayerId) || data.targetType === 'EVERYONE';

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4 space-y-4">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campfire-card border border-campfire-flame/40 text-xs text-campfire-gold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-campfire-flame" />
          <span>Story Comparison {currentIndex + 1} of {totalQuestions}</span>
        </div>
        <h2 className="text-2xl font-display font-black text-white uppercase fire-text-glow">
          Perspective Clash
        </h2>
        <p className="text-xs text-campfire-muted">
          Compare what was asked, what was assumed, and what actually happened.
        </p>
      </div>

      {/* The Question */}
      <div className="campfire-card-glow rounded-3xl p-5">
        <span className="text-[10px] uppercase font-bold text-campfire-muted tracking-wider block mb-1">
          The Question
        </span>
        <blockquote className="text-base font-display font-medium text-white">
          &ldquo;{data.questionContent}&rdquo;
        </blockquote>
      </div>

      {/* Structured Comparison Grid */}
      <div className="space-y-3">
        {/* Initial Interpreter POV */}
        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-campfire-gold flex items-center gap-1.5">
              <span>{data.initialInterpreterName}&apos;s Interpretation:</span>
            </span>
            <span className="text-[10px] text-campfire-muted lowercase bg-campfire-darkest px-2 py-0.5 rounded-full border border-campfire-border">
              random interpreter
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 italic bg-campfire-darkest/60 p-3 rounded-xl border border-campfire-border/40">
            &ldquo;{data.initialAnswer || 'Shared their immediate reaction with the circle.'}&rdquo;
          </p>
        </div>

        {/* Intended Target's Perspective */}
        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-campfire-flame">
              {data.targetNames && data.targetNames.length > 0 ? data.targetNames.join(', ') : 'The Target'}&apos;s Real Response:
            </span>
            <span className="text-[10px] text-campfire-muted lowercase bg-campfire-darkest px-2 py-0.5 rounded-full border border-campfire-border">
              actual target
            </span>
          </div>
          {data.actualTargetResponse ? (
            <p className="text-xs sm:text-sm text-slate-200 italic bg-campfire-darkest/60 p-3 rounded-xl border border-campfire-border/40">
              &ldquo;{data.actualTargetResponse}&rdquo;
            </p>
          ) : isTarget ? (
            <div className="space-y-2 mt-2">
              <textarea
                value={targetNote}
                onChange={(e) => setTargetNote(e.target.value)}
                placeholder="Since this was meant for you, what actually was your side of the story?"
                rows={2}
                className="w-full px-3 py-2 bg-campfire-darkest border border-campfire-border rounded-xl text-xs text-slate-100 placeholder:text-campfire-muted/50 focus:outline-none focus:border-campfire-flame resize-none"
              />
              <button
                onClick={handleSaveContext}
                disabled={submittingNote || !targetNote.trim()}
                className="w-full py-2 bg-campfire-flame/20 border border-campfire-flame text-campfire-gold rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Target&apos;s Perspective</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-campfire-muted italic bg-campfire-darkest/40 p-3 rounded-xl">
              Discussing aloud in person...
            </div>
          )}
        </div>

        {/* Author Context */}
        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/70">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-campfire-gold">
              {data.authorName}&apos;s Context &amp; Intent:
            </span>
            <span className="text-[10px] text-campfire-muted lowercase bg-campfire-darkest px-2 py-0.5 rounded-full border border-campfire-border">
              author
            </span>
          </div>
          {data.authorContext ? (
            <p className="text-xs sm:text-sm text-slate-200 italic bg-campfire-darkest/60 p-3 rounded-xl border border-campfire-border/40">
              &ldquo;{data.authorContext}&rdquo;
            </p>
          ) : isAuthor ? (
            <div className="space-y-2 mt-2">
              <textarea
                value={authorNote}
                onChange={(e) => setAuthorNote(e.target.value)}
                placeholder="Why did you ask this? What incident were you thinking of?"
                rows={2}
                className="w-full px-3 py-2 bg-campfire-darkest border border-campfire-border rounded-xl text-xs text-slate-100 placeholder:text-campfire-muted/50 focus:outline-none focus:border-campfire-flame resize-none"
              />
              <button
                onClick={handleSaveContext}
                disabled={submittingNote || !authorNote.trim()}
                className="w-full py-2 bg-campfire-flame/20 border border-campfire-flame text-campfire-gold rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Add Author&apos;s Backstory</span>
              </button>
            </div>
          ) : (
            <div className="text-xs text-campfire-muted italic bg-campfire-darkest/40 p-3 rounded-xl">
              Discussing aloud in person...
            </div>
          )}
        </div>

        {/* What We Assumed (Room Guesses) */}
        <div className="campfire-card rounded-2xl p-4 border border-campfire-border/70">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-campfire-flame" />
            <span>What the Circle Assumed</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-campfire-darkest/80 rounded-xl border border-campfire-border/50">
              <div className="text-lg font-bold text-campfire-gold">{data.correctAuthorGuesses}</div>
              <div className="text-[10px] text-campfire-muted">Guessed author correctly</div>
            </div>
            <div className="p-3 bg-campfire-darkest/80 rounded-xl border border-campfire-border/50">
              <div className="text-lg font-bold text-campfire-flame">{data.correctTargetGuesses}</div>
              <div className="text-[10px] text-campfire-muted">Guessed target correctly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Controls: Next Story */}
      {isHost && (
        <button
          onClick={onNextStory}
          className="w-full btn-fire-primary text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-sm shadow-flame active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <span>{currentIndex + 1 < totalQuestions ? 'Next Lore Reveal' : 'Complete Lore Chronicle'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
