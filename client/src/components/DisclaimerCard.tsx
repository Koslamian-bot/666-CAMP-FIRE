import React from 'react';
import { Flame, ShieldCheck, HeartHandshake, Eye, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DisclaimerCardProps {
  onAccept: () => void;
  isAccepted: boolean;
  acceptedCount: number;
  totalPlayers: number;
}

export const DisclaimerCard: React.FC<DisclaimerCardProps> = ({
  onAccept,
  isAccepted,
  acceptedCount,
  totalPlayers,
}) => {
  const handleAccept = () => {
    sounds.playFlameFlare();
    onAccept();
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6">
      <div className="campfire-card-glow rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Mystic ember backdrop banner */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-campfire-flame to-campfire-gold flex items-center justify-center shadow-flame">
          <Flame className="w-9 h-9 text-slate-950 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-campfire-gold via-campfire-flame to-campfire-ember mb-2">
          Before We Start
        </h2>
        <p className="text-campfire-muted text-sm mb-6">
          This game is built for fun, real conversation, and understanding.
        </p>

        {/* Disclaimer Points */}
        <div className="space-y-3.5 text-left text-xs sm:text-sm text-slate-200 bg-campfire-darkest/60 border border-campfire-border/50 rounded-2xl p-4 sm:p-5 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-campfire-gold shrink-0 mt-0.5" />
            <p>
              Questions may involve memories, misunderstandings, group lore, awkward situations, or different perspectives.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-campfire-flame shrink-0 mt-0.5" />
            <p>
              Nobody's perspective is automatically the &ldquo;correct&rdquo; one. <strong>Do not treat the game like a courtroom.</strong>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-campfire-gold shrink-0 mt-0.5" />
            <p>
              Nobody is forced to reveal anything uncomfortable. Private matters remain private unless voluntarily shared.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 text-campfire-ember shrink-0 mt-0.5" />
            <p>
              Everyone sitting here is an equal participant around this campfire. No cliques or special privileges.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Flame className="w-4 h-4 text-campfire-gold shrink-0 mt-0.5" />
            <p>
              Misunderstandings are normal. Human beings have somehow managed to misunderstand each other since language was invented.
            </p>
          </div>

          <div className="pt-2 border-t border-campfire-border/40 text-[11px] text-campfire-muted text-center italic">
            Honest discussion may strengthen bonds or expose funny assumptions. The purpose is clarity and entertainment!
          </div>
        </div>

        {/* Acceptance Action */}
        {isAccepted ? (
          <div className="py-3 px-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span>Oath accepted. Waiting for {totalPlayers - acceptedCount} players...</span>
          </div>
        ) : (
          <button
            onClick={handleAccept}
            className="w-full btn-fire-primary text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide text-base shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🔥 I Understand. Start the Chaos</span>
          </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-campfire-muted">
          <span className="inline-block w-2 h-2 rounded-full bg-campfire-flame animate-ping" />
          <span>{acceptedCount} of {totalPlayers} around the fire have agreed</span>
        </div>
      </div>
    </div>
  );
};
