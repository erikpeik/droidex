import { useState } from 'react';
import { Lock, Plus, X, AlertTriangle } from 'lucide-react';
import { ALL_CARDS } from '../data/droids';
import { SquadType, SQUAD_DEFINITIONS, getRebirthRequirementsForDroid } from '../data/squads';

interface Props {
  cardId: string | null;
  squadType: SquadType;
  slotIndex: number;
  isLocked: boolean;
  unlockLevel: number | null;
  currentRebirthLevel: number;
  onSelect: () => void;
  onRemove: () => void;
}

const TIER_BORDER: Record<string, string> = {
  DEFAULT: 'border-zinc-700 hover:border-zinc-500',
  GOLD: 'border-amber-500/60 hover:border-amber-400',
  DIAMOND: 'border-sky-400/60 hover:border-sky-300',
  RAINBOW: 'rainbow-border-animated',
  BESKAR: 'beskar-border',
};

const TIER_COLOR: Record<string, string> = {
  DEFAULT: 'text-zinc-400',
  GOLD: 'text-amber-400',
  DIAMOND: 'text-sky-300',
  RAINBOW: 'text-purple-400',
  BESKAR: 'text-yellow-200',
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

export function SquadSlot({
  cardId,
  squadType,
  isLocked,
  unlockLevel,
  currentRebirthLevel,
  onSelect,
  onRemove,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);
  const def = SQUAD_DEFINITIONS[squadType];
  const card = cardId ? ALL_CARDS.find((c) => c.id === cardId) : null;

  // Rebirth requirement check
  const rebirthReqs = card ? getRebirthRequirementsForDroid(card.id) : [];
  const isNeededForNextRebirth = rebirthReqs.some((r) => r.rebirthLevel === currentRebirthLevel + 1);
  const isNeededForFutureRebirth = rebirthReqs.some((r) => r.rebirthLevel > currentRebirthLevel);

  if (isLocked) {
    return (
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40 flex flex-col items-center justify-center text-center p-2 select-none">
        <Lock className="w-5 h-5 text-zinc-700 mb-1" />
        <span className="text-[9px] font-semibold text-zinc-600 uppercase tracking-wider leading-tight">
          Locked
        </span>
        <span className="text-[10px] font-bold text-orange-700 mt-0.5">
          Rebirth {unlockLevel}
        </span>
      </div>
    );
  }

  if (!card) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className="group relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-900/10 hover:bg-zinc-900/30 flex flex-col items-center justify-center text-center p-2 transition-all duration-150 active:scale-95 cursor-pointer"
        style={{
          '--hover-glow': def.themeColor,
        } as React.CSSProperties}
      >
        <Plus className="w-6 h-6 text-zinc-600 group-hover:text-zinc-400 group-hover:scale-110 transition-transform mb-1" />
        <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-wide">
          Assign
        </span>
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none duration-150"
             style={{ backgroundColor: def.themeColor }} />
      </button>
    );
  }

  const badge = TYPE_BADGE[card.droid.type];
  const isRainbow = card.tier === 'RAINBOW';
  const isBeskar = card.tier === 'BESKAR';

  return (
    <div
      className={`group relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border-[3px] bg-zinc-950/80 overflow-hidden transition-all duration-150 hover:brightness-110 ${
        TIER_BORDER[card.tier] ?? 'border-zinc-700'
      } ${isBeskar ? 'beskar-card' : ''}`}
    >
      {/* Droid image */}
      <div
        className="w-full h-full cursor-pointer relative"
        onClick={onSelect}
        title={`Click to swap ${card.droid.name} (${card.tier})`}
      >
        {!imgFailed ? (
          <img
            src={imgSrc(card.droid.name, card.tier)}
            alt={card.droid.name}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900">
            <img src={badge.img} alt={card.droid.type} className="w-6 h-6 object-contain" />
          </div>
        )}

        {/* Rebirth warning banner/indicator */}
        {isNeededForNextRebirth && (
          <div className="absolute top-0 left-0 bg-red-600 text-white p-0.5 rounded-br border-r border-b border-red-500 animate-pulse flex items-center gap-0.5 z-10"
               title={`URGENT: Required for next rebirth (Rebirth ${currentRebirthLevel + 1})`}>
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[8px] font-black tracking-wide">NEED!</span>
          </div>
        )}
        {!isNeededForNextRebirth && isNeededForFutureRebirth && (
          <div className="absolute top-0 left-0 bg-amber-500 text-black p-0.5 rounded-br flex items-center gap-0.5 z-10"
               title={`Required for a future rebirth (Rebirth ${rebirthReqs.map(r => r.rebirthLevel).join(', ')})`}>
            <span className="text-[8px] font-extrabold tracking-wide uppercase px-0.5">Keep</span>
          </div>
        )}

        {/* Footer label */}
        <div className="absolute bottom-0 inset-x-0 bg-black/75 px-1 py-0.5 text-center leading-tight">
          <p className="text-[9px] font-bold text-white truncate">{card.droid.name}</p>
          <p className={`text-[8px] font-semibold uppercase ${TIER_COLOR[card.tier] ?? 'text-zinc-400'}`}>
            {card.tier}
          </p>
        </div>
      </div>

      {/* Remove button (X) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        title={`Remove ${card.droid.name} from slot`}
        className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-zinc-400 hover:text-white rounded-full p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 border border-zinc-700/50 z-20"
      >
        <X className="w-3 h-3" />
      </button>

      {isBeskar && <div className="beskar-zebra" aria-hidden="true" />}
      {isRainbow && <div className="tv-distortion" aria-hidden="true" />}
    </div>
  );
}
