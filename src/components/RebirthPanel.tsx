import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { REBIRTH_LEVELS, MAX_REBIRTH } from '../data/rebirths';
import { getSquadUnlockDescription } from '../data/squads';

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
  BESKAR: 'text-yellow-200',
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
  const panelContentId = 'rebirth-panel-content';

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
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelContentId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((v) => !v); } }}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900/70 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="glow-orange text-orange-400 font-bold text-sm tracking-wider uppercase">
            Rebirth
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
            <span className="text-orange-400 font-bold text-base w-6 text-center font-mono">
              {rebirthLevel}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSetRebirth(Math.min(MAX_REBIRTH, rebirthLevel + 1));
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
              {getSquadUnlockDescription(nextRebirth.to) && (
                <span className="text-[9px] font-black text-teal-400 bg-teal-950/60 border border-teal-900/60 rounded px-1.5 py-0.5 ml-2 uppercase tracking-wide">
                  Reward: {getSquadUnlockDescription(nextRebirth.to)}
                </span>
              )}
            </span>
          ) : (
            <span className="text-yellow-400 text-xs font-bold tracking-wide">
              MAX REBIRTH
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
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
          <Link
            to="/rebirths"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-orange-500 hover:text-orange-400 border border-orange-500/20 hover:border-orange-500/50 rounded px-2 py-1 bg-orange-950/20 transition-all font-semibold flex items-center gap-1.5"
          >
            <span>Full Path</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <span className="text-zinc-600 text-xs ml-1">{open ? '▼' : '▲'}</span>
        </div>
        </div>

      {open && nextRebirth && (
        <div id={panelContentId} className="px-4 pb-4 pt-1">
          {/* NEED divider */}
          <div className="flex items-center gap-3 mb-3">
            <div className="need-divider-left flex-1 h-px" />
            <span className="need-label text-[10px] font-black tracking-[0.2em] uppercase">
              NEED
            </span>
            <div className="need-divider-right flex-1 h-px" />
          </div>

          {/* Cards container */}
          <div className="rounded-xl border border-zinc-800/80 px-4 py-3 bg-black/40">
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Credits card */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <div className="relative w-[88px] h-[88px] rounded-xl border-[3px] border-zinc-700 flex flex-col items-center justify-center overflow-hidden bg-black">
                    <img
                      src={`${import.meta.env.BASE_URL}img/credits.png`}
                      alt="Credits"
                      className="w-12 h-12 object-contain"
                    />
                    <span className="text-amber-400 font-bold text-base leading-tight text-center font-mono">
                      {nextRebirth.credits}
                    </span>
                  </div>
                </div>
                <span className="text-amber-400 text-[10px] font-bold w-[88px] text-center truncate">
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
                    {/* Card */}
                    <div className="relative">
                      <div
                        className={`relative w-[88px] h-[88px] rounded-xl border-[3px] overflow-hidden bg-zinc-900 ${have ? 'droid-card-owned' : 'droid-card-missing'}`}
                      >
                        {/* Droid image */}
                        <img
                          src={imgSrc(d.name, d.tier)}
                          alt={d.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              'none';
                          }}
                        />

                        <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 bg-black/60">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wide ${TIER_CLASS[d.tier] ?? 'text-gray-400'}`}
                          >
                            {d.tier}
                          </span>
                        </div>
                      </div>

                      {/* Check / X circle — top left on border */}
                      <div
                        className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center z-10 ${have ? 'bg-green-500' : 'bg-red-500'}`}
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
                    <span className="text-white text-[10px] font-semibold w-[88px] text-center truncate">
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
        <div id={panelContentId} className="px-4 pb-4 pt-2 text-center">
          <span className="glow-yellow text-yellow-400 font-bold text-sm tracking-wider uppercase">
            ★ MAX REBIRTH REACHED ★
          </span>
        </div>
      )}
    </div>
  );
}
