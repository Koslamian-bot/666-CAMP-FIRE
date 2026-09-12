import React, { useState, useEffect } from 'react';
import { Player } from '../types/game';
import { sounds } from '../utils/audio';
import { Flame, Compass, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CampfireSpinnerProps {
  players: Player[];
  chosenSpeakerId?: string;
  chosenSpeakerName?: string;
  isHost: boolean;
  gameMode?: string;
  onTriggerSpin: () => void;
  onProceedToAnswer: () => void;
}

export const CampfireSpinner: React.FC<CampfireSpinnerProps> = ({
  players,
  chosenSpeakerName,
  isHost,
  onTriggerSpin,
  onProceedToAnswer,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dramaticReveal, setDramaticReveal] = useState(false);

  // When chosenSpeakerName is received, animate the wheel to land on that person
  useEffect(() => {
    if (chosenSpeakerName && !isSpinning) {
      triggerDramaticSelection(chosenSpeakerName);
    }
  }, [chosenSpeakerName]);

  const triggerDramaticSelection = (name: string) => {
    setIsSpinning(true);
    setDramaticReveal(false);

    let speed = 70;
    let step = 0;
    const totalSteps = 24 + Math.floor(Math.random() * 8);

    const interval = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % players.length);
      sounds.playTick();
      step++;

      if (step > totalSteps * 0.7) {
        speed += 35;
      }

      if (step >= totalSteps) {
        clearInterval(interval);
        // Find index of target speaker
        const targetIdx = players.findIndex((p) => p.displayName === name);
        if (targetIdx !== -1) {
          setHighlightedIndex(targetIdx);
        }
        setIsSpinning(false);
        setDramaticReveal(true);
        sounds.playReveal();

        // Ember confetti burst
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF5722', '#FF7A00', '#FFB703', '#E63946'],
        });
      }
    }, speed);
  };

  const handleStartSpin = () => {
    if (isSpinning) return;
    sounds.playFlameFlare();
    onTriggerSpin();
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campfire-card border border-campfire-border/70 text-xs text-campfire-gold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-campfire-flame" />
        <span>The Ember Ritual</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-white mb-1 uppercase fire-text-glow">
        The Fire Chooses
      </h2>
      <p className="text-xs text-campfire-muted mb-6">
        The flame will select who receives and interprets the next secret.
      </p>

      {/* Wheel / Fire Compass Visual */}
      <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
        {/* Outer Ember Glow Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-campfire-flame/30 bg-campfire-darkest/80 shadow-flame-lg" />
        <div className="absolute inset-4 rounded-full border border-dashed border-campfire-gold/30 animate-spin-slow" />

        {/* Players arranged on the circle */}
        {players.map((p, idx) => {
          const angle = (idx / players.length) * 2 * Math.PI - Math.PI / 2;
          const radius = 95;
          const x = 128 + radius * Math.cos(angle);
          const y = 128 + radius * Math.sin(angle);
          const isHighlighted = idx === highlightedIndex;

          return (
            <div
              key={p.id}
              style={{ left: `${x}px`, top: `${y}px` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-150 z-20 flex flex-col items-center ${
                isHighlighted ? 'scale-125 z-30' : 'scale-90 opacity-70'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-lg transition-all ${
                  isHighlighted
                    ? 'bg-campfire-flame border-white text-slate-950 shadow-flame ring-4 ring-campfire-flame/40 animate-pulse'
                    : 'bg-campfire-card border-campfire-border text-slate-200'
                }`}
              >
                {p.displayName.charAt(0).toUpperCase()}
              </div>
              <span
                className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded-md truncate max-w-[65px] ${
                  isHighlighted
                    ? 'bg-campfire-flame text-slate-950 font-extrabold'
                    : 'bg-campfire-darkest/90 text-slate-300'
                }`}
              >
                {p.displayName}
              </span>
            </div>
          );
        })}

        {/* Center Flame Needle */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-campfire-flame to-campfire-gold flex items-center justify-center shadow-flame animate-pulse">
          <Flame className="w-10 h-10 text-slate-950 animate-bounce" />
        </div>
      </div>

      {/* Result Climax */}
      {dramaticReveal && chosenSpeakerName ? (
        <div className="w-full campfire-card-glow rounded-3xl p-6 mb-6 animate-bounce">
          <div className="text-xs uppercase tracking-widest text-campfire-gold font-bold mb-1">
            🔥 The Campfire Has Decided
          </div>
          <div className="text-3xl font-display font-black text-white fire-text-glow-lg uppercase mb-2">
            {chosenSpeakerName}
          </div>
          <p className="text-xs text-campfire-muted mb-4">
            A secret has arrived on {chosenSpeakerName}&apos;s device.
          </p>

          <button
            onClick={onProceedToAnswer}
            className="w-full btn-fire-primary text-white py-3.5 px-6 rounded-2xl font-bold tracking-wide text-sm shadow-flame active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Open &amp; Read Question</span>
          </button>
        </div>
      ) : (
        /* Host Spin Action or Waiting */
        <div className="w-full">
          {isHost ? (
            <button
              onClick={handleStartSpin}
              disabled={isSpinning}
              className="w-full btn-fire-primary disabled:opacity-50 text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-base shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 animate-spin" />
              <span>{isSpinning ? 'Consulting the Fire...' : 'Spin the Campfire Flame'}</span>
            </button>
          ) : (
            <div className="py-3 px-4 bg-campfire-card/70 border border-campfire-border/50 rounded-2xl text-xs text-campfire-muted flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-campfire-flame animate-ping" />
              <span>Waiting for the host to spin the campfire...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
