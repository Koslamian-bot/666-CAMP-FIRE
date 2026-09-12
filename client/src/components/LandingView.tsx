import React, { useState } from 'react';
import { CampfireVisual } from './CampfireVisual';
import { GameMode } from '../types/game';
import { Flame, Compass, Wine, ArrowRight, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface LandingViewProps {
  onCreateRoom: (data: {
    roomName: string;
    theme?: string;
    maxPlayers?: number;
    gameMode: GameMode;
    hostDisplayName: string;
    hostAvatarSeed: string;
  }) => Promise<void>;
  onJoinRoom: (data: {
    roomCode: string;
    displayName: string;
    avatarSeed: string;
  }) => Promise<void>;
  initialJoinCode?: string;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onCreateRoom,
  onJoinRoom,
  initialJoinCode = '',
}) => {
  const [tab, setTab] = useState<'welcome' | 'create' | 'join'>(initialJoinCode ? 'join' : 'welcome');
  const [soundActive, setSoundActive] = useState(true);
  const [showExampleTooltip, setShowExampleTooltip] = useState(false);

  // Form states
  const [roomName, setRoomName] = useState('The Ancient Lore');
  const [theme, setTheme] = useState('Trip Incidents & Awkward Memories');
  const [maxPlayers, setMaxPlayers] = useState(12);
  const [gameMode, setGameMode] = useState<GameMode>('DIGITAL_SPINNER');
  const [displayName, setDisplayName] = useState('');
  const [roomCode, setRoomCode] = useState(initialJoinCode);
  const [avatarSeed, setAvatarSeed] = useState('flame-1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatars = [
    { id: 'flame-1', label: 'Embers', emoji: '🔥' },
    { id: 'flame-2', label: 'Ash', emoji: '🌑' },
    { id: 'flame-3', label: 'Spark', emoji: '✨' },
    { id: 'flame-4', label: 'Lantern', emoji: '🏮' },
    { id: 'flame-5', label: 'Torch', emoji: '🕯️' },
    { id: 'flame-6', label: 'Blaze', emoji: '🦊' },
  ];

  const toggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundActive(newState);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !roomName.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      sounds.playFlameFlare();
      await onCreateRoom({
        roomName: roomName.trim(),
        theme: theme.trim(),
        maxPlayers,
        gameMode,
        hostDisplayName: displayName.trim(),
        hostAvatarSeed: avatarSeed,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create campfire');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !roomCode.trim() || loading) return;

    try {
      setLoading(true);
      setError(null);
      sounds.playFlameFlare();
      await onJoinRoom({
        roomCode: roomCode.trim().toUpperCase(),
        displayName: displayName.trim(),
        avatarSeed,
      });
    } catch (err: any) {
      setError(err.message || 'Could not find that campfire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4 min-h-[90vh] flex flex-col justify-between">
      {/* Sound / Header Bar */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-campfire-flame animate-bounce" />
          <span className="font-display font-black text-sm tracking-widest text-slate-300">
            666-CAMP-FIRE
          </span>
        </div>
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl bg-campfire-card border border-campfire-border text-campfire-muted hover:text-white transition-all active:scale-90"
          title="Toggle Ambiance Sound"
        >
          {soundActive ? <Volume2 className="w-4 h-4 text-campfire-gold" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="my-auto py-4">
        {tab === 'welcome' && (
          <div className="text-center space-y-6">
            <CampfireVisual size="lg" interactive={true} />

            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-white mb-2 uppercase fire-text-glow">
                666-Camp-Fire <span className="text-campfire-flame">🔥</span>
              </h1>
              <p className="text-xs sm:text-sm text-campfire-muted max-w-xs mx-auto leading-relaxed">
                A room-based social lore &amp; perspective game for friends physically sitting together.
              </p>
            </div>

            {/* Core Premise Tagline */}
            <div className="p-4 bg-campfire-darkest/80 border border-campfire-border/60 rounded-2xl text-left text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 font-bold text-campfire-gold text-xs">
                <Sparkles className="w-4 h-4 text-campfire-flame" />
                <span>The Core Concept</span>
              </div>
              <p className="text-[12px] text-campfire-muted leading-relaxed">
                Friend groups often develop fragmented memories, awkward misunderstandings, and differing assumptions.
                <strong> 666-camp-fire</strong> surfaces those different perspectives in a warm, playful setting where everyone experiences the story through someone else&apos;s eyes.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              <button
                onClick={() => {
                  sounds.playSpark();
                  setTab('create');
                }}
                className="w-full btn-fire-primary text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-base shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Ignite a New Campfire</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  sounds.playSpark();
                  setTab('join');
                }}
                className="w-full btn-fire-secondary text-slate-100 py-3.5 px-6 rounded-2xl font-bold tracking-wide text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Sit by an Existing Fire</span>
              </button>
            </div>

            {/* Campfire Laws (Rules) */}
            <div className="campfire-card rounded-3xl p-5 text-left border border-campfire-flame/30 space-y-3.5 mt-6">
              <div className="flex items-center justify-between border-b border-campfire-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-campfire-flame" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    The Campfire Laws
                  </h3>
                </div>
                <span className="text-[10px] text-campfire-gold font-mono uppercase bg-campfire-darkest px-2 py-0.5 rounded-full border border-campfire-border">
                  Core Rules
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-campfire-flame mt-1.5 shrink-0" />
                  <p className="text-slate-200">
                    <strong className="text-white">Zero Subgroups:</strong> No cliques, sides, or factions. Everyone joins as an equal player around one shared fire.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-campfire-gold mt-1.5 shrink-0" />
                  <p className="text-slate-200">
                    <strong className="text-white">Perspectives, Not Verdicts:</strong> This is not a courtroom or trial. Nobody&apos;s memory is automatically the &ldquo;correct&rdquo; one.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-campfire-flame mt-1.5 shrink-0" />
                  <p className="text-slate-200">
                    <strong className="text-white">Privacy Respected:</strong> Anyone can choose to Answer Now, Answer Later, or Pass. No emotional pressure or public shaming.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-campfire-gold mt-1.5 shrink-0" />
                  <p className="text-slate-200">
                    <strong className="text-white">Strict Anonymity:</strong> Authors and intended recipients remain physically hidden until the cinematic reveal phase.
                  </p>
                </div>
              </div>
            </div>

            {/* Entire Game Flow & Interactive Example Tooltip */}
            <div className="campfire-card-glow rounded-3xl p-5 text-left border border-campfire-border/70 space-y-4 mt-4">
              <div className="flex items-center justify-between border-b border-campfire-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-campfire-gold" />
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    Entire Game Flow
                  </h3>
                </div>

                {/* Example Tooltip Toggle Button */}
                <button
                  onClick={() => {
                    sounds.playSpark();
                    setShowExampleTooltip(!showExampleTooltip);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1.5 border active:scale-95 ${
                    showExampleTooltip
                      ? 'bg-campfire-flame text-slate-950 border-campfire-gold shadow-flame'
                      : 'bg-campfire-darkest text-campfire-gold border-campfire-flame/50 hover:border-campfire-flame'
                  }`}
                  title="Toggle example walkthrough"
                >
                  <span>💡</span>
                  <span>{showExampleTooltip ? 'Hide Example' : 'See Example'}</span>
                </button>
              </div>

              {/* Step-by-Step Flow List */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-white">Circle Up in the Lobby</div>
                    <div className="text-campfire-muted text-[11px]">Host opens the room; friends physically sitting together join via 6-character room code or camera QR scan.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-white">The Oath &amp; Secret Whispers</div>
                    <div className="text-campfire-muted text-[11px]">Everyone accepts the campfire oath. Each player submits anonymous questions and secretly selects who it was really meant for.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-white">Fair Perspective Shuffle</div>
                    <div className="text-campfire-muted text-[11px]">The system automatically shuffles questions to someone else. The person who receives the question is NOT necessarily who it was intended for!</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-bold text-white">The Campfire Spinner Chooses</div>
                    <div className="text-campfire-muted text-[11px]">The glowing flame wheel spins and dramatically picks the next speaker. The question unlocks only on their phone.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    5
                  </div>
                  <div>
                    <div className="font-bold text-white">Read Aloud &amp; Answer from Your POV</div>
                    <div className="text-campfire-muted text-[11px]">Speaker reads the secret aloud and explains how they personally interpret it from their own perspective.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    6
                  </div>
                  <div>
                    <div className="font-bold text-white">Open Banter &amp; Anonymous Guesses</div>
                    <div className="text-campfire-muted text-[11px]">The room discusses what situation this refers to. Players anonymously guess who wrote it and who was the true target.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    7
                  </div>
                  <div>
                    <div className="font-bold text-white">The Staged Lore Reveal</div>
                    <div className="text-campfire-muted text-[11px]">
                      Stage 1 reveals the <em>Intended Recipient</em>. Stage 2 reveals the <em>True Author</em>. Full context is unveiled!
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-campfire-darkest border border-campfire-flame/40 flex items-center justify-center font-mono font-bold text-campfire-gold text-[11px] shrink-0">
                    8
                  </div>
                  <div>
                    <div className="font-bold text-white">Perspective Clash &amp; Lore Chronicle</div>
                    <div className="text-campfire-muted text-[11px]">Compare what was assumed, what the target says, what the author meant, and reconstruct the true shared group lore.</div>
                  </div>
                </div>
              </div>

              {/* Tooltip Example Content (Only opened when user toggles it) */}
              {showExampleTooltip && (
                <div className="p-4 bg-campfire-darkest/95 border border-campfire-flame rounded-2xl space-y-3 animate-pulse-glow shadow-flame">
                  <div className="flex items-center justify-between border-b border-campfire-border/60 pb-2">
                    <span className="font-bold text-xs text-campfire-gold flex items-center gap-1.5">
                      <span>🔥 Walkthrough Example: The Goa Trip Incident</span>
                    </span>
                    <button
                      onClick={() => setShowExampleTooltip(false)}
                      className="text-[10px] text-campfire-muted hover:text-white uppercase font-bold"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="space-y-2.5 text-[11px] leading-relaxed">
                    <div className="p-2.5 rounded-xl bg-campfire-surface/80 border border-campfire-border/40">
                      <strong className="text-campfire-gold">Step A: Karthik Writes a Secret:</strong>
                      <p className="text-slate-200 mt-0.5">
                        Karthik writes: <em>&ldquo;Why did that situation become awkward between us after the trip?&rdquo;</em> and secretly targets <strong>Arun</strong>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-campfire-surface/80 border border-campfire-border/40">
                      <strong className="text-campfire-flame">Step B: Shuffled to Priya:</strong>
                      <p className="text-slate-200 mt-0.5">
                        Priya is chosen by the spinner. She doesn&apos;t know who wrote it or who it was meant for. She reads it aloud and answers: <em>&ldquo;I assumed everyone was tense because of the rental car breakdown!&rdquo;</em>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-campfire-surface/80 border border-campfire-border/40">
                      <strong className="text-campfire-gold">Step C: The Circle Debates:</strong>
                      <p className="text-slate-200 mt-0.5">
                        Everyone laughs and debates. The room casts anonymous guesses on who asked it and who it was really targeting.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-campfire-surface/80 border border-campfire-border/40">
                      <strong className="text-campfire-flame">Step D: The Grand Reveal:</strong>
                      <p className="text-slate-200 mt-0.5">
                        The fire reveals: <em>Intended for <strong>Arun</strong></em>, <em>Written by <strong>Karthik</strong></em>! The room gasps: <em>&ldquo;Wait, we thought this was about Rahul and Maya!&rdquo;</em>
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-campfire-flame/20 to-transparent border border-campfire-flame/50">
                      <strong className="text-white">The Outcome:</strong>
                      <p className="text-slate-200 mt-0.5">
                        Arun shares his side, Karthik clarifies what he meant, and fragmented lore becomes clear and shared without any courtroom drama!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'create' && (
          <div className="campfire-card-glow rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-campfire-border/50 pb-3">
              <h2 className="text-xl font-display font-black text-white uppercase fire-text-glow">
                Host a Campfire
              </h2>
              <button
                onClick={() => setTab('welcome')}
                className="text-xs text-campfire-muted hover:text-white"
              >
                Back
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Arun, Karthik, Mia"
                  className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Pick Your Campfire Icon
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarSeed(av.id)}
                      className={`p-2 rounded-xl text-lg border flex items-center justify-center transition-all ${
                        avatarSeed === av.id
                          ? 'bg-campfire-flame/30 border-campfire-flame shadow-flame scale-105'
                          : 'bg-campfire-darkest/60 border-campfire-border/50'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Campfire Circle Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Goa Trip Lore, Midnight Reunion"
                  className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Session Theme (optional)
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Misunderstandings & Hidden Backstories"
                  className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              {/* Game Mode Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Speaker Selection Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGameMode('DIGITAL_SPINNER')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      gameMode === 'DIGITAL_SPINNER'
                        ? 'bg-campfire-flame/20 border-campfire-flame text-white font-bold'
                        : 'bg-campfire-darkest border-campfire-border text-slate-300'
                    }`}
                  >
                    <Compass className="w-4 h-4 text-campfire-flame" />
                    <span>Digital Spinner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGameMode('PHYSICAL_BOTTLE')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                      gameMode === 'PHYSICAL_BOTTLE'
                        ? 'bg-campfire-flame/20 border-campfire-flame text-white font-bold'
                        : 'bg-campfire-darkest border-campfire-border text-slate-300'
                    }`}
                  >
                    <Wine className="w-4 h-4 text-campfire-gold" />
                    <span>Physical Bottle</span>
                  </button>
                </div>
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex justify-between">
                  <span>Circle Capacity</span>
                  <span className="text-campfire-gold font-bold">{maxPlayers} players</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full accent-campfire-flame cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !displayName.trim() || !roomName.trim()}
                className="w-full btn-fire-primary text-white py-4 rounded-2xl font-bold tracking-wide text-sm shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Igniting Campfire...' : 'Create & Open Lobby'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {tab === 'join' && (
          <div className="campfire-card-glow rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-campfire-border/50 pb-3">
              <h2 className="text-xl font-display font-black text-white uppercase fire-text-glow">
                Join the Circle
              </h2>
              <button
                onClick={() => setTab('welcome')}
                className="text-xs text-campfire-muted hover:text-white"
              >
                Back
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Campfire Code
                </label>
                <input
                  type="text"
                  required
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="e.g. 6CF-420"
                  className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-flame/40 focus:border-campfire-flame rounded-xl text-center font-mono text-lg tracking-widest text-campfire-gold uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={30}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Arun, Karthik, Mia"
                  className="w-full px-4 py-3 bg-campfire-darkest border border-campfire-border focus:border-campfire-flame rounded-xl text-sm text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Pick Your Campfire Icon
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {avatars.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setAvatarSeed(av.id)}
                      className={`p-2 rounded-xl text-lg border flex items-center justify-center transition-all ${
                        avatarSeed === av.id
                          ? 'bg-campfire-flame/30 border-campfire-flame shadow-flame scale-105'
                          : 'bg-campfire-darkest/60 border-campfire-border/50'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !displayName.trim() || !roomCode.trim()}
                className="w-full btn-fire-primary text-white py-4 rounded-2xl font-bold tracking-wide text-sm shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sitting down...' : 'Join Campfire Circle'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center py-2 text-[11px] text-campfire-muted">
        <span>No subgroup labels. Equal perspective for all participants.</span>
      </div>
    </div>
  );
};
