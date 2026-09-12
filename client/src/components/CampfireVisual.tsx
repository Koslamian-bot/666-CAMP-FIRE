import React, { useState } from 'react';
import { sounds } from '../utils/audio';

interface CampfireVisualProps {
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const CampfireVisual: React.FC<CampfireVisualProps> = ({ size = 'md', interactive = true }) => {
  const [sparkCount, setSparkCount] = useState<number>(0);

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-52 h-52',
  }[size];

  const handlePokeFire = () => {
    if (!interactive) return;
    sounds.playSpark();
    setSparkCount((prev) => prev + 1);
  };

  return (
    <div
      onClick={handlePokeFire}
      className={`relative ${sizeClasses} mx-auto flex items-center justify-center cursor-pointer select-none`}
      title={interactive ? 'Tap to poke the campfire 🔥' : undefined}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-campfire-flame/20 rounded-full blur-2xl animate-pulse-glow" />
      <div className="absolute inset-4 bg-campfire-gold/15 rounded-full blur-xl animate-pulse" />

      {/* SVG Campfire Layers */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(255,122,0,0.6)]"
      >
        <defs>
          <radialGradient id="fireOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FF3D00" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#BF360C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fireCore" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FF5722" />
            <stop offset="50%" stopColor="#FFB703" />
            <stop offset="100%" stopColor="#FFF4D2" />
          </linearGradient>
          <linearGradient id="woodLog" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3E2723" />
            <stop offset="100%" stopColor="#1B0000" />
          </linearGradient>
        </defs>

        {/* Campfire Stones */}
        <ellipse cx="100" cy="165" rx="70" ry="16" fill="#1B1724" opacity="0.8" />
        <circle cx="50" cy="165" r="10" fill="#2B2438" />
        <circle cx="70" cy="172" r="11" fill="#362E47" />
        <circle cx="95" cy="175" r="12" fill="#2E273D" />
        <circle cx="125" cy="173" r="11" fill="#3B324D" />
        <circle cx="150" cy="166" r="10" fill="#2A2338" />

        {/* Campfire Logs */}
        <rect
          x="45"
          y="152"
          width="110"
          height="14"
          rx="7"
          fill="url(#woodLog)"
          transform="rotate(-15 100 160)"
          stroke="#5D4037"
          strokeWidth="1.5"
        />
        <rect
          x="45"
          y="152"
          width="110"
          height="14"
          rx="7"
          fill="url(#woodLog)"
          transform="rotate(15 100 160)"
          stroke="#4E342E"
          strokeWidth="1.5"
        />

        {/* Outer Flame shape */}
        <path
          d="M100 30 C120 70, 150 100, 140 145 C130 170, 70 170, 60 145 C50 100, 80 70, 100 30 Z"
          fill="#FF3D00"
          opacity="0.8"
          className="animate-flicker origin-bottom"
        />

        {/* Middle Flame shape */}
        <path
          d="M100 45 C115 80, 135 110, 130 145 C120 165, 80 165, 70 145 C65 110, 85 80, 100 45 Z"
          fill="#FF7A00"
          className="animate-pulse origin-bottom"
        />

        {/* Core Hot Flame */}
        <path
          d="M100 65 C110 95, 122 120, 118 145 C112 160, 88 160, 82 145 C78 120, 90 95, 100 65 Z"
          fill="url(#fireCore)"
          className="animate-pulse-glow origin-bottom"
        />

        {/* Dynamic Flying Sparks based on interaction */}
        {Array.from({ length: 4 }).map((_, i) => (
          <circle
            key={`${sparkCount}-${i}`}
            cx={90 + (i * 7) + (Math.sin(sparkCount + i) * 15)}
            cy={60 - (i * 12) - ((sparkCount % 5) * 5)}
            r={1.5 + (i % 2)}
            fill="#FFE082"
            opacity={0.8}
            className="animate-bounce"
          />
        ))}
      </svg>
    </div>
  );
};
