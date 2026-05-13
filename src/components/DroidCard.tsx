import { useState } from 'react';
import { Wrench, Satellite, Crosshair, RefreshCw, type LucideIcon } from 'lucide-react';
import type { DroidCard as DroidCardType } from '../data/droids';

interface Props {
  card: DroidCardType;
  collected: boolean;
  onToggle: (id: string) => void;
  highlighted?: boolean;
  rebirthLevels?: number[];
}

const RARITY_COLOR: Record<string, string> = {
  COMMON: '#16a34a',
  RARE: '#3b82f6',
  EPIC: '#a855f7',
  LEGENDARY: '#f59e0b',
  MYTHIC: '#ef4444',
};

const TYPE_BADGE: Record<string, { Icon: LucideIcon; bg: string }> = {
  WORKER: { Icon: Wrench, bg: '#16a34a' },
  ASTROMECH: { Icon: Satellite, bg: '#7c3aed' },
  BATTLE: { Icon: Crosshair, bg: '#dc2626' },
};

const TIER_BORDER: Record<string, string> = {
  DEFAULT: 'border-zinc-600',
  GOLD: 'border-amber-400',
  DIAMOND: 'border-sky-300',
  RAINBOW: 'border-transparent',
};

const TIER_GLOW: Record<string, string> = {
  DEFAULT: '',
  GOLD: '0 0 10px 2px rgba(251,191,36,0.4)',
  DIAMOND: '0 0 10px 2px rgba(147,220,255,0.4)',
  RAINBOW: '0 0 12px 3px rgba(168,85,247,0.4)',
};

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`;
}

export function DroidCard({ card, collected, onToggle, highlighted, rebirthLevels }: Props) {
  const { droid, tier, id } = card;
  const rarityColor = RARITY_COLOR[droid.rarity];
  const badge = TYPE_BADGE[droid.type];
  const isRainbow = tier === 'RAINBOW';
  const [imgFailed, setImgFailed] = useState(false);

  const ringClass = highlighted
    ? 'ring-2 ring-yellow-400 ring-inset'
    : collected
      ? 'ring-2 ring-cyan-400 ring-inset'
      : '';

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      title={`${droid.name} (${tier}) — click to toggle`}
      className={[
        'relative flex flex-col rounded-lg border-4 overflow-hidden',
        'transition-all duration-150 select-none cursor-pointer',
        'bg-zinc-900 active:scale-95',
        collected || highlighted ? 'hover:brightness-110' : 'opacity-40 hover:opacity-90',
        TIER_BORDER[tier],
        isRainbow ? 'rainbow-border-animated' : '',
        ringClass,
      ].join(' ')}
      style={{
        boxShadow: TIER_GLOW[tier] || undefined,
      }}
    >
      {/* Droid image */}
      <div className="w-full flex-1 min-h-[6rem] overflow-hidden bg-zinc-800">
        {!imgFailed ? (
          <img
            src={imgSrc(droid.name, tier)}
            alt={droid.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ color: rarityColor }}
          >
            <badge.Icon size={32} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-black px-2 pt-1 pb-1.5">
        <p className="text-white font-black italic leading-tight truncate text-sm">
          {droid.name}
        </p>
        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          <span
            className="text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-wide inline-block"
            style={{
              color: rarityColor,
              backgroundColor: rarityColor + '22',
              border: `1px solid ${rarityColor}66`,
            }}
          >
            {droid.rarity}
          </span>
          {rebirthLevels && rebirthLevels.length > 0 && (
            <span
              className="text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-wide inline-block text-orange-400 bg-orange-500/15 border border-orange-500/40"
              title={`Required for rebirth${rebirthLevels.length > 1 ? 's' : ''} ${rebirthLevels.join(', ')}`}
            >
              <RefreshCw size={8} className="inline-block mr-0.5 align-middle" />{rebirthLevels.join('·')}
            </span>
          )}
        </div>
      </div>

      {/* Type icon — top right */}
      <div
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md flex items-center justify-center"
        style={{ backgroundColor: badge.bg }}
      >
        <badge.Icon size={14} color="white" />
      </div>

      {/* Collected checkmark — top left */}
      {collected && (
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center">
          <svg
            viewBox="0 0 10 10"
            className="w-3 h-3 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M1.5 5l2.5 2.5 4.5-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Event locked overlay */}
      {droid.eventLocked && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-red-400 text-[10px] font-bold text-center leading-tight px-1">
            EVENT
            <br />
            LOCKED
          </span>
        </div>
      )}
    </button>
  );
}
