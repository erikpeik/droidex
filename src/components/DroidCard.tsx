import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import type { DroidCard as DroidCardType } from '../data/droids';

interface Props {
  card: DroidCardType;
  collected: boolean;
  onToggle: (id: string) => void;
  highlighted?: boolean;
  rebirthLevels?: number[];
}

const RARITY_CLASS: Record<string, string> = {
  COMMON:    'text-green-600 bg-green-600/15 border border-green-600/40',
  RARE:      'text-blue-500 bg-blue-500/15 border border-blue-500/40',
  EPIC:      'text-purple-500 bg-purple-500/15 border border-purple-500/40',
  LEGENDARY: 'text-amber-400 bg-amber-400/15 border border-amber-400/40',
  MYTHIC:    'text-red-500 bg-red-500/15 border border-red-500/40',
};

const TYPE_BADGE: Record<string, { img: string; bg: string }> = {
  WORKER:    { img: `${import.meta.env.BASE_URL}img/worker.png`,    bg: '#16a34a' },
  ASTROMECH: { img: `${import.meta.env.BASE_URL}img/astromech.png`, bg: '#7c3aed' },
  BATTLE:    { img: `${import.meta.env.BASE_URL}img/battle.png`,    bg: '#dc2626' },
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
        'relative flex flex-col border-4 overflow-hidden',
        'transition-all duration-150 select-none cursor-pointer',
        'bg-zinc-900 active:scale-95 droid-card hover:brightness-110',
        TIER_BORDER[tier],
        isRainbow ? 'rainbow-border-animated' : '',
        ringClass,
      ].join(' ')}
      style={{
        boxShadow: TIER_GLOW[tier] || undefined,
      }}
    >
      {/* Droid image */}
      <div className="relative w-full flex-1 min-h-[6rem] overflow-hidden bg-zinc-800">
        {!imgFailed ? (
          <img
            src={imgSrc(droid.name, tier)}
            alt={droid.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={badge.img} alt={droid.type} className="w-8 h-8 object-contain" />
          </div>
        )}

        {/* Uncollected placeholder overlay */}
        {!collected && !highlighted && (
          <div className="absolute inset-0 bg-black/65" />
        )}

        <div className="tv-distortion" />
        {droid.eventLocked && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
            <span className="text-red-400 text-[8px] font-bold tracking-widest uppercase bg-black/50 px-1.5 py-0.5 rounded">
              event locked
            </span>
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
            className={`${RARITY_CLASS[droid.rarity]} text-[9px] font-bold px-1.5 py-px rounded-full uppercase tracking-wide inline-block`}
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
      <div className="absolute top-1.5 right-1.5 z-20 w-6 h-6">
        <img src={badge.img} alt={droid.type} className="w-full h-full object-contain" />
      </div>

      {/* Collected checkbox — top left */}
      <div className={`absolute top-1.5 left-1.5 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
        collected
          ? 'bg-cyan-400 border-cyan-400'
          : 'bg-black/40 border-zinc-400'
      }`}>
        {collected && (
          <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="black" strokeWidth="2.5">
            <path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

    </button>
  );
}
