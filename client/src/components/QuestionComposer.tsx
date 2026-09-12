import React, { useState } from 'react';
import { Player, TargetType } from '../types/game';
import { Send, Shield, Users, User, Flame, CheckCircle2, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';

interface QuestionComposerProps {
  players: Player[];
  currentPlayerId: string;
  isHost: boolean;
  totalQuestions: number;
  mySubmitted?: boolean;
  onSubmitQuestion: (data: {
    questionContent: string;
    isSensitive: boolean;
    targetType: TargetType;
    targetPlayerIds?: string[];
  }) => Promise<void>;
  onLockSubmissions: () => void;
  onShuffleAndStart: () => void;
}

export const QuestionComposer: React.FC<QuestionComposerProps> = ({
  players,
  currentPlayerId,
  isHost,
  totalQuestions,
  onSubmitQuestion,
  onLockSubmissions,
  onShuffleAndStart,
}) => {
  const [content, setContent] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [targetType, setTargetType] = useState<TargetType>('EVERYONE');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const eligibleTargets = players.filter((p) => p.id !== currentPlayerId);

  const toggleTarget = (playerId: string) => {
    if (selectedTargets.includes(playerId)) {
      setSelectedTargets(selectedTargets.filter((id) => id !== playerId));
    } else {
      setSelectedTargets([...selectedTargets, playerId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading) return;

    try {
      setLoading(true);
      await onSubmitQuestion({
        questionContent: content.trim(),
        isSensitive,
        targetType,
        targetPlayerIds: targetType === 'EVERYONE' ? undefined : selectedTargets,
      });
      sounds.playSpark();
      setContent('');
      setIsSensitive(false);
      setSelectedTargets([]);
    } finally {
      setLoading(false);
    }
  };

  const funWaitingQuotes = [
    'Collecting secrets into the ash...',
    'Someone is typing something dangerous...',
    'Human communication is already getting complicated...',
    'Assumptions are simmering around the fire...',
  ];
  const randomQuote = funWaitingQuotes[totalQuestions % funWaitingQuotes.length];

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4">
      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-campfire-card border border-campfire-border/70 text-xs text-campfire-gold mb-2">
          <Flame className="w-3.5 h-3.5 text-campfire-flame" />
          <span>{totalQuestions} secrets gathered in the fire</span>
        </div>
        <h2 className="text-2xl font-display font-black text-white tracking-wide">
          Whisper to the Campfire
        </h2>
        <p className="text-xs text-campfire-muted mt-1">
          Ask about an awkward incident, misunderstanding, or group lore.
        </p>
      </div>

      {/* Submission Card */}
      <div className="campfire-card-glow rounded-3xl p-5 sm:p-6 mb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Your Anonymous Question
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. Why did that situation become awkward between us after the trip?"
              rows={3}
              maxLength={400}
              className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-2xl text-slate-100 placeholder:text-campfire-muted/50 text-sm focus:outline-none focus:ring-1 focus:ring-campfire-flame transition-all resize-none"
            />
          </div>

          {/* Intended Recipient */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>Who is this actually meant for?</span>
              <span className="text-[10px] text-campfire-gold font-normal lowercase">(hidden until reveal)</span>
            </label>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTargetType('EVERYONE')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  targetType === 'EVERYONE'
                    ? 'bg-campfire-flame/20 border-campfire-flame text-campfire-gold font-bold'
                    : 'bg-campfire-darkest/60 border-campfire-border text-slate-300'
                }`}
              >
                <Users className="w-4 h-4 text-campfire-flame" />
                <span>Everyone in room</span>
              </button>

              <button
                type="button"
                onClick={() => setTargetType('SINGLE')}
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  targetType !== 'EVERYONE'
                    ? 'bg-campfire-flame/20 border-campfire-flame text-campfire-gold font-bold'
                    : 'bg-campfire-darkest/60 border-campfire-border text-slate-300'
                }`}
              >
                <User className="w-4 h-4 text-campfire-gold" />
                <span>Specific person</span>
              </button>
            </div>

            {targetType !== 'EVERYONE' && (
              <div className="bg-campfire-darkest/70 border border-campfire-border/60 rounded-2xl p-3 max-h-36 overflow-y-auto space-y-1.5 mb-2">
                <div className="text-[11px] text-campfire-muted mb-1">Select player(s):</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {eligibleTargets.map((p) => {
                    const isSelected = selectedTargets.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleTarget(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs truncate border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-campfire-flame/30 border-campfire-flame text-white font-bold'
                            : 'bg-campfire-surface border-campfire-border/50 text-slate-300'
                        }`}
                      >
                        <span className="truncate">{p.displayName}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-campfire-gold shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Privacy & Sensitivity Option */}
          <div className="flex items-center justify-between py-2 px-3 bg-campfire-darkest/40 rounded-xl border border-campfire-border/40">
            <label htmlFor="sensitive-check" className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <Shield className="w-4 h-4 text-campfire-gold" />
              <span>Mark as sensitive topic</span>
            </label>
            <input
              id="sensitive-check"
              type="checkbox"
              checked={isSensitive}
              onChange={(e) => setIsSensitive(e.target.checked)}
              className="accent-campfire-flame w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {/* Strict Privacy Reassurance */}
          <div className="flex items-center gap-2 text-[11px] text-campfire-muted/90 bg-campfire-card/80 p-2.5 rounded-xl border border-campfire-border/50">
            <Lock className="w-3.5 h-3.5 text-campfire-flame shrink-0" />
            <span>Your identity and chosen recipient remain strictly hidden until the reveal phase.</span>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || loading || (targetType !== 'EVERYONE' && selectedTargets.length === 0)}
            className="w-full btn-fire-primary disabled:opacity-40 text-white py-3.5 px-5 rounded-2xl font-bold text-sm shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Casting to Fire...' : 'Cast Secret into the Campfire'}</span>
          </button>
        </form>
      </div>

      {/* Fun status message */}
      <div className="text-center py-2.5 px-4 bg-campfire-card/60 border border-campfire-border/40 rounded-2xl mb-6">
        <p className="text-xs text-campfire-gold font-medium italic">
          &ldquo;{randomQuote}&rdquo;
        </p>
      </div>

      {/* Host Controls: Lock Submissions & Fair Shuffle */}
      {isHost && (
        <div className="campfire-card rounded-2xl p-4 border border-campfire-flame/30 space-y-2.5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Host Campfire Controls</span>
            <span className="text-campfire-gold">{totalQuestions} secrets</span>
          </div>
          <p className="text-[11px] text-campfire-muted">
            Once everyone has submitted at least one question, lock submissions and shuffle perspectives fairly.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onLockSubmissions}
              className="py-2.5 px-3 bg-campfire-surface border border-campfire-border rounded-xl text-xs font-bold text-slate-200 hover:border-campfire-flame active:scale-95 transition-all"
            >
              Lock Submissions
            </button>
            <button
              onClick={onShuffleAndStart}
              disabled={totalQuestions < 1}
              className="py-2.5 px-3 btn-fire-primary disabled:opacity-40 rounded-xl text-xs font-bold text-white shadow-flame active:scale-95 transition-all"
            >
              Shuffle &amp; Begin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
