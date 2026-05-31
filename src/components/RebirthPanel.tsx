import { useMemo, useState } from 'react';
import { REBIRTH_LEVELS } from '../data/rebirths';

interface Props {
  rebirthLevel: number;
  collected: Set<string>;
  onSetRebirth: (level: number) => void;
  onHighlight: (ids: Set<string>) => void;
}

const TIER_CLASS: Record<string, string> = {
  DEFAULT: 'text-gray-400',
  GOLD: 'text-amber-400',
  DIAMOND: 'text-sky-300',
  RAINBOW: 'rainbow-tab',
};

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`;
}

export function RebirthPanel({
  rebirthLevel,
  collected,
  onSetRebirth,
  onHighlight,
}: Props) {
  const [open, setOpen] = useState(true);

  const nextRebirth = useMemo(
    () => REBIRTH_LEVELS.find((r) => r.from === rebirthLevel),
    [rebirthLevel],
  );

  const allMet = useMemo(
    () => nextRebirth?.droids.every((d) => collected.has(d.cardId)) ?? false,
    [nextRebirth, collected],
  );

  const ownedCount = useMemo(
    () =>
      nextRebirth?.droids.filter((d) => collected.has(d.cardId)).length ?? 0,
    [nextRebirth, collected],
  );

  const handleMouseEnter = () => {
    if (nextRebirth) {
      onHighlight(new Set(nextRebirth.droids.map((d) => d.cardId)));
    }
  };
  const handleMouseLeave = () => onHighlight(new Set());

  return (
    <div
      className={`border-t rebirth-panel ${allMet ? 'rebirth-panel-ready' : 'rebirth-panel-pending'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="glow-orange text-orange-400 font-bold text-sm tracking-widest uppercase">
            REBIRTH
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetRebirth(Math.max(0, rebirthLevel - 1));
              }}
              className="w-6 h-6 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-orange-900/40 hover:border-orange-700/60 hover:text-orange-300 flex items-center justify-center text-sm leading-none transition-colors font-bold"
            >
              −
            </button>
            <span className="text-orange-400 font-bold text-base w-6 text-center">
              {rebirthLevel}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetRebirth(Math.min(23, rebirthLevel + 1));
              }}
              className="w-6 h-6 rounded-sm bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-orange-900/40 hover:border-orange-700/60 hover:text-orange-300 flex items-center justify-center text-sm leading-none transition-colors font-bold"
            >
              +
            </button>
          </div>
          {nextRebirth ? (
            <span className="text-zinc-500 text-xs flex items-center gap-0.5">
              <span className="text-orange-700">→</span>
              <span>
                Rebirth{' '}
                <span className="text-zinc-300 font-bold">
                  {nextRebirth.to}
                </span>
              </span>
            </span>
          ) : (
            <span className="text-yellow-400 text-xs font-bold tracking-wide">
              MAX REBIRTH
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {nextRebirth &&
            (allMet ? (
              <span className="glow-green text-xs font-bold text-green-400">
                ✓ READY
              </span>
            ) : (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs font-bold text-red-400">
                  {ownedCount}/{nextRebirth.droids.length} droids
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: nextRebirth.droids.length }, (_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1 rounded-full ${i < ownedCount ? 'bg-orange-500' : 'bg-zinc-700'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          <span className="text-zinc-600 text-xs">{open ? '▼' : '▲'}</span>
        </div>
      </button>

      {open && nextRebirth && (
        <div className="px-4 pb-4 pt-1">
          {/* NEED divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="need-divider-left flex-1 h-px" />
            <span className="need-label text-[10px] font-black tracking-[0.3em] uppercase">
              NEED
            </span>
            <div className="need-divider-right flex-1 h-px" />
          </div>

          {/* Cards container */}
          <div className="rounded-xl border border-zinc-800/80 px-4 py-3 bg-black/40">
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Credits card */}
              <div className="flex flex-col items-center gap-1">
                <div className="h-5" />
                <div className="credits-card relative w-[88px] h-[88px] rounded-xl border-2 border-amber-500/70 flex flex-col items-center justify-center gap-0.5 overflow-hidden">
                  <div className="credits-card-glow absolute inset-0 pointer-events-none" />
                  <span className="text-amber-400 text-base leading-none relative z-10">
                    ◎
                  </span>
                  <span className="text-amber-400 font-black text-base leading-tight text-center px-1 relative z-10">
                    {nextRebirth.credits}
                  </span>
                  <span className="text-amber-600 text-[8px] uppercase tracking-widest relative z-10">
                    credits
                  </span>
                </div>
                <span className="text-zinc-400 text-[10px] font-bold w-[88px] text-center truncate">
                  Credits
                </span>
              </div>

              {/* Droid cards */}
              {nextRebirth.droids.map((d) => {
                const have = collected.has(d.cardId);
                return (
                  <div
                    key={d.cardId}
                    className="flex flex-col items-center gap-1"
                  >
                    {/* Warning triangle above card if missing */}
                    <div className="h-5 flex items-center justify-center">
                      {!have && (
                        <div className="flex items-center justify-center w-5 h-5 rounded bg-yellow-400/15">
                          <svg
                            viewBox="0 0 16 14"
                            className="w-3.5 h-3.5"
                            fill="none"
                          >
                            <polygon
                              points="8,1 15,13 1,13"
                              fill="#facc15"
                              stroke="#ca8a04"
                              strokeWidth="0.5"
                            />
                            <text
                              x="8"
                              y="11.5"
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                              fill="#1c1917"
                            >
                              !
                            </text>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Card */}
                    <div
                      className={`relative w-[88px] h-[88px] rounded-xl border-2 overflow-hidden bg-zinc-900 ${have ? 'droid-card-owned' : 'droid-card-missing'}`}
                    >
                      {/* Droid image */}
                      <img
                        src={imgSrc(d.name, d.tier)}
                        alt={d.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />

                      {/* Tier label — bottom inside */}
                      <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 bg-black/60">
                        <span
                          className={`text-[8px] font-black uppercase tracking-wide ${TIER_CLASS[d.tier] ?? 'text-gray-400'}`}
                        >
                          {d.tier}
                        </span>
                      </div>

                      {/* Check / X circle — top left */}
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center ${have ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {have ? (
                          <svg
                            viewBox="0 0 10 10"
                            className="w-3 h-3"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M1.5 5l2.5 2.5 4.5-4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 10 10"
                            className="w-3 h-3"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                          >
                            <path d="M2 2l6 6M8 2l-6 6" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Name below */}
                    <span className="text-white text-[10px] font-bold w-[88px] text-center truncate">
                      {d.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {open && !nextRebirth && (
        <div className="px-4 pb-4 pt-2 text-center">
          <span className="glow-yellow text-yellow-400 font-black text-sm tracking-widest uppercase">
            ★ MAX REBIRTH REACHED ★
          </span>
        </div>
      )}
    </div>
  );
}
