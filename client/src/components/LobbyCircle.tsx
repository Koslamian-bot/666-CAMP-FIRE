import React, { useState } from 'react';
import { Player, GameMode } from '../types/game';
import { CampfireVisual } from './CampfireVisual';
import { Copy, QrCode, Crown, Users, Play, Sparkles, Check, Wine, Compass } from 'lucide-react';
import QRCode from 'qrcode';

interface LobbyCircleProps {
  roomCode: string;
  roomName: string;
  theme?: string;
  players: Player[];
  maxPlayers: number;
  isHost: boolean;
  gameMode: GameMode;
  onStartDisclaimer: () => void;
  onGameModeChange?: (mode: GameMode) => void;
}

export const LobbyCircle: React.FC<LobbyCircleProps> = ({
  roomCode,
  roomName,
  theme,
  players,
  maxPlayers,
  isHost,
  gameMode,
  onStartDisclaimer,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showQrCode = async () => {
    try {
      const joinUrl = `${window.location.origin}?join=${roomCode}`;
      const url = await QRCode.toDataURL(joinUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0B0A0F',
          light: '#FFF3E0',
        },
      });
      setQrDataUrl(url);
      setQrModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-4 flex flex-col items-center">
      {/* Header Info */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-campfire-card border border-campfire-border/60 text-xs text-campfire-muted mb-2">
          <Sparkles className="w-3.5 h-3.5 text-campfire-gold" />
          <span>{theme || 'Secret Stories & Perspectives'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black tracking-wide text-white uppercase fire-text-glow">
          {roomName}
        </h1>
      </div>

      {/* Room Code & Share Chips */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={copyRoomCode}
          className="px-4 py-2 bg-campfire-card border border-campfire-flame/40 hover:border-campfire-flame rounded-2xl flex items-center gap-2 text-sm font-mono tracking-widest text-campfire-gold shadow-flame transition-all active:scale-95"
        >
          <span>{roomCode}</span>
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 opacity-70" />}
        </button>

        <button
          onClick={showQrCode}
          className="p-2.5 bg-campfire-card border border-campfire-border rounded-2xl text-slate-300 hover:text-white hover:border-campfire-flame active:scale-95 transition-all"
          title="Show QR Code for quick mobile join"
        >
          <QrCode className="w-5 h-5 text-campfire-flame" />
        </button>
      </div>

      {/* Central Campfire & Seated Players */}
      <div className="w-full relative py-6 flex flex-col items-center justify-center">
        {/* Central Campfire */}
        <CampfireVisual size="md" interactive={true} />

        {/* Live count badge */}
        <div className="mt-3 px-3.5 py-1 bg-campfire-card/90 border border-campfire-border rounded-full flex items-center gap-2 text-xs text-slate-200">
          <Users className="w-3.5 h-3.5 text-campfire-flame" />
          <span>
            <strong className="text-campfire-gold">{players.length}</strong> / {maxPlayers} around the campfire
          </span>
        </div>
      </div>

      {/* Seated Players Grid */}
      <div className="w-full mt-2 mb-8">
        <h3 className="text-xs uppercase tracking-wider text-campfire-muted font-bold text-center mb-3">
          Sitting at the Campfire
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {players.map((player, idx) => (
            <div
              key={player.id}
              className="px-3 py-2.5 bg-campfire-card/80 border border-campfire-border/60 rounded-2xl flex items-center gap-2.5 text-left text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-campfire-flame/40 to-campfire-gold/30 border border-campfire-flame/50 flex items-center justify-center text-campfire-gold font-bold shrink-0">
                {player.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-slate-100 truncate text-xs sm:text-sm flex items-center gap-1">
                  <span>{player.displayName}</span>
                  {idx === 0 && <Crown className="w-3 h-3 text-campfire-gold shrink-0" />}
                </div>
                <div className="text-[10px] text-campfire-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>present</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Host Controls or Player Waiting Status */}
      {isHost ? (
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between p-3 bg-campfire-darkest/70 border border-campfire-border/60 rounded-2xl text-xs text-slate-300">
            <span className="font-medium flex items-center gap-2">
              {gameMode === 'DIGITAL_SPINNER' ? (
                <Compass className="w-4 h-4 text-campfire-flame" />
              ) : (
                <Wine className="w-4 h-4 text-campfire-gold" />
              )}
              <span>Mode: {gameMode === 'DIGITAL_SPINNER' ? 'Digital Fire Spinner' : 'Physical Bottle'}</span>
            </span>
          </div>

          <button
            onClick={onStartDisclaimer}
            disabled={players.length < 2}
            className="w-full btn-fire-primary disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-bold tracking-wide text-base shadow-flame hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{players.length < 2 ? 'Need 2+ Players to Start' : 'Ignite Campfire & Begin'}</span>
          </button>
        </div>
      ) : (
        <div className="w-full text-center py-3 px-4 bg-campfire-card/70 border border-campfire-border/50 rounded-2xl text-xs text-campfire-muted flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-campfire-gold animate-ping" />
          <span>Waiting for the campfire host to ignite the circle...</span>
        </div>
      )}

      {/* QR Code Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="campfire-card-glow rounded-3xl p-6 max-w-xs w-full text-center">
            <h3 className="text-lg font-bold text-white mb-1">Scan to Join Fire</h3>
            <p className="text-xs text-campfire-muted mb-4">Point your mobile camera to join the circle</p>
            {qrDataUrl && (
              <div className="p-3 bg-white rounded-2xl inline-block mb-4 shadow-xl">
                <img src={qrDataUrl} alt="Room QR Code" className="w-56 h-56 mx-auto rounded-lg" />
              </div>
            )}
            <div className="font-mono text-campfire-gold font-bold text-lg tracking-wider mb-4">
              {roomCode}
            </div>
            <button
              onClick={() => setQrModalOpen(false)}
              className="w-full py-2.5 bg-campfire-card border border-campfire-border rounded-xl text-xs font-bold text-slate-300 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
