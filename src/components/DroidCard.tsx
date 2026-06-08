import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { TIER_BORDER, TIER_GLOW, type DroidCard as DroidCardType } from '../data/droids';
import droidStats from '../data/droidStats.json';

interface Props {
  card: DroidCardType;
  collected: boolean;
  onToggle: (id: string) => void;
  highlighted?: boolean;
  rebirthLevels?: number[];
}

interface TierStats {
  cost: string | null;
  income: string | null;
  value: string | null;
}

const RARITY_CLASS: Record<string, string> = {
  COMMON: 'text-green-600 bg-green-600/15 border border-green-600/40',
  RARE: 'text-blue-500 bg-blue-500/15 border border-blue-500/40',
  EPIC: 'text-purple-500 bg-purple-500/15 border border-purple-500/40',
  LEGENDARY: 'text-amber-400 bg-amber-400/15 border border-amber-400/40',
  MYTHIC: 'text-red-500 bg-red-500/15 border border-red-500/40',
};

const TYPE_BADGE: Record<string, { img: string; bg: string }> = {
  WORKER: { img: `${import.meta.env.BASE_URL}img/worker.png`, bg: '#16a34a' },
  ASTROMECH: {
    img: `${import.meta.env.BASE_URL}img/astromech.png`,
    bg: '#7c3aed',
  },
  BATTLE: { img: `${import.meta.env.BASE_URL}img/battle.png`, bg: '#dc2626' },
};



function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`;
}

function getStats(name: string, tier: string): TierStats | null {
  const byName = (droidStats as Record<string, Record<string, TierStats>>)[
    name
  ];
  return byName?.[tier] ?? null;
}

export function DroidCard({
  card,
  collected,
  onToggle,
  highlighted,
  rebirthLevels,
}: Props) {
  const { droid, tier, id } = card;
  const badge = TYPE_BADGE[droid.type];
  const isBeskar = tier === 'BESKAR';
  const [imgFailed, setImgFailed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const stats = getStats(droid.name, tier);

  const ringClass = highlighted
    ? 'ring-2 ring-yellow-400 ring-inset'
    : collected
      ? 'ring-2 ring-cyan-400 ring-inset'
      : '';

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${droid.name} (${tier}) — click to toggle`}
      className={[
        'relative flex flex-col border-4 overflow-hidden',
        'transition-all duration-150 select-none cursor-pointer',
        'bg-zinc-900 active:scale-95 droid-card hover:brightness-110',
        TIER_BORDER[tier],
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
            <img
              src={badge.img}
              alt={droid.type}
              className="w-8 h-8 object-contain"
            />
          </div>
        )}

        {/* Uncollected placeholder overlay */}
        {!collected && !highlighted && (
          <div className="absolute inset-0 bg-black/65" />
        )}

        <div className="tv-distortion" />

        {isBeskar && (
          <div className="beskar-zebra" aria-hidden="true" />
        )}

        {/* Stats HUD — slides up on hover */}
        {stats && (
          <div
            className={`absolute inset-x-0 bottom-0 z-30 transition-transform duration-200 ease-out ${hovered ? 'translate-y-0' : 'translate-y-full'}`}
          >
            <div className="bg-black/90 border-t border-zinc-700/80 px-2 py-1.5 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-x-1 text-center">
                <div>
                  <p className="text-[8px] font-bold tracking-wider text-zinc-500 uppercase">
                    COST
                  </p>
                  <p className="text-[10px] font-bold text-amber-400 leading-tight glow-amber-sm font-mono">
                    {stats.cost ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold tracking-wider text-zinc-500 uppercase">
                    INCOME
                  </p>
                  <p className="text-[10px] font-bold text-cyan-400 leading-tight glow-cyan-sm font-mono">
                    {stats.income ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold tracking-wider text-zinc-500 uppercase">
                    VALUE
                  </p>
                  <p className="text-[10px] font-bold text-emerald-400 leading-tight glow-emerald-sm font-mono">
                    {stats.value ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {droid.eventLocked && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1">
            <span className="text-red-400 text-[9px] font-bold tracking-wider uppercase bg-black/50 px-1.5 py-0.5 rounded">
              event locked
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full bg-black px-2 pt-1 pb-1.5">
        <p className="text-white font-bold leading-tight truncate text-sm">
          {droid.name}
        </p>
        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          <span
            className={`${RARITY_CLASS[droid.rarity]} text-[10px] font-semibold px-1.5 py-px rounded-full uppercase tracking-wide inline-block`}
          >
            {droid.rarity}
          </span>
          {rebirthLevels && rebirthLevels.length > 0 && (
            <span
              className="text-[10px] font-semibold px-1.5 py-px rounded-full uppercase tracking-wide inline-block text-orange-400 bg-orange-500/15 border border-orange-500/40"
              title={`Required for rebirth${rebirthLevels.length > 1 ? 's' : ''} ${rebirthLevels.join(', ')}`}
            >
              <RefreshCw
                size={8}
                className="inline-block mr-0.5 align-middle"
              />
              {rebirthLevels.join('·')}
            </span>
          )}
        </div>

        {/* HUD strip — cost | income always visible */}
        {stats && (stats.cost !== null || stats.income !== null) && (
          <div className="flex mt-1.5 border border-zinc-800">
            <div className="flex-1 flex items-center justify-center gap-0.5 px-1 py-1 bg-zinc-950">
              <span className="text-amber-500 text-[9px] leading-none">◎</span>
              <span className="text-amber-400 text-[10px] font-bold leading-none glow-amber-sm whitespace-nowrap font-mono">
                {stats.cost ?? '—'}
              </span>
            </div>
            <div className="w-px bg-zinc-800" />
            <div className="flex-1 flex items-center justify-center gap-0.5 px-1 py-1 bg-zinc-950">
              <span className="text-cyan-400 text-[9px] leading-none">⚡</span>
              <span className="text-cyan-400 text-[10px] font-bold leading-none glow-cyan-sm whitespace-nowrap font-mono">
                {stats.income ?? '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Type icon — top right */}
      <div className="absolute top-1.5 right-1.5 z-20 w-6 h-6">
        <img
          src={badge.img}
          alt={droid.type}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Collected checkbox — top left */}
      <div
        className={`absolute top-1.5 left-1.5 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${collected
            ? 'bg-cyan-400 border-cyan-400'
            : 'bg-black/40 border-zinc-400'
          }`}
      >
        {collected && (
          <svg
            viewBox="0 0 10 10"
            className="w-3 h-3"
            fill="none"
            stroke="black"
            strokeWidth="2.5"
          >
            <path
              d="M1.5 5l2.5 2.5 4.5-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
