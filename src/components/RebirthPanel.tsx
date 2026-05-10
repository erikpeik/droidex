import { useMemo, useState } from 'react'
import { REBIRTH_LEVELS } from '../data/rebirths'

interface Props {
  rebirthLevel: number
  collected: Set<string>
  onSetRebirth: (level: number) => void
  onHighlight: (ids: Set<string>) => void
}

const TIER_COLORS: Record<string, string> = {
  DEFAULT: '#9ca3af',
  GOLD:    '#fbbf24',
  DIAMOND: '#7dd3fc',
  RAINBOW: '#c084fc',
}

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_')
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`
}

export function RebirthPanel({ rebirthLevel, collected, onSetRebirth, onHighlight }: Props) {
  const [open, setOpen] = useState(true)

  const nextRebirth = useMemo(
    () => REBIRTH_LEVELS.find((r) => r.from === rebirthLevel),
    [rebirthLevel]
  )

  const allMet = useMemo(
    () => nextRebirth?.droids.every((d) => collected.has(d.cardId)) ?? false,
    [nextRebirth, collected]
  )

  const handleMouseEnter = () => {
    if (nextRebirth) {
      onHighlight(new Set(nextRebirth.droids.map((d) => d.cardId)))
    }
  }
  const handleMouseLeave = () => onHighlight(new Set())

  return (
    <div
      className="border-t border-zinc-800 bg-zinc-950"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-zinc-900 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-orange-400 font-bold text-sm tracking-wide uppercase">Rebirth</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSetRebirth(Math.max(0, rebirthLevel - 1)) }}
              className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 flex items-center justify-center text-xs leading-none"
            >−</button>
            <span className="text-orange-400 font-bold text-base w-6 text-center">{rebirthLevel}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSetRebirth(Math.min(20, rebirthLevel + 1)) }}
              className="w-5 h-5 rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 flex items-center justify-center text-xs leading-none"
            >+</button>
          </div>
          {nextRebirth ? (
            <span className="text-zinc-500 text-xs">→ Rebirth {nextRebirth.to}</span>
          ) : (
            <span className="text-yellow-400 text-xs font-bold">MAX REBIRTH</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {nextRebirth && (
            <span className={`text-xs font-bold ${allMet ? 'text-green-400' : 'text-red-400'}`}>
              {allMet ? '✓ READY' : `${nextRebirth.droids.filter((d) => collected.has(d.cardId)).length}/${nextRebirth.droids.length} droids`}
            </span>
          )}
          <span className="text-zinc-600 text-xs">{open ? '▼' : '▲'}</span>
        </div>
      </button>

      {open && nextRebirth && (
        <div className="px-4 pb-4">
          {/* NEED header */}
          <div className="flex items-center justify-center mb-3">
            <span className="px-6 py-1 bg-zinc-800 rounded-xl text-white font-black text-lg tracking-widest uppercase border border-zinc-700">
              NEED
            </span>
          </div>

          {/* Cards row */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Credits card */}
            <div className="flex flex-col items-center gap-1">
              <div className="h-4" />
              <div className="w-[76px] h-[76px] rounded-xl border-2 border-yellow-500 bg-zinc-900 flex flex-col items-center justify-center gap-0.5"
                style={{ boxShadow: '0 0 8px 2px rgba(234,179,8,0.35)' }}
              >
                <span className="text-zinc-400 text-[9px] uppercase tracking-widest">Need</span>
                <span className="text-yellow-400 font-black text-base leading-tight text-center px-1">{nextRebirth.credits}</span>
              </div>
              <span className="text-white text-[10px] font-bold w-[76px] text-center truncate">Credits</span>
            </div>

            {/* Droid cards */}
            {nextRebirth.droids.map((d) => {
              const have = collected.has(d.cardId)
              const tierColor = TIER_COLORS[d.tier]
              return (
                <div key={d.cardId} className="flex flex-col items-center gap-1">
                  {/* Yellow warning triangle above card if missing */}
                  <div className="h-4 flex items-center justify-center">
                    {!have && (
                      <svg viewBox="0 0 16 14" className="w-4 h-4" fill="none">
                        <polygon points="8,1 15,13 1,13" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                        <text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1c1917">!</text>
                      </svg>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    className="relative w-[76px] h-[76px] rounded-xl border-2 overflow-hidden bg-zinc-900"
                    style={{
                      borderColor: have ? '#22c55e' : '#ef4444',
                      boxShadow: have
                        ? '0 0 8px 2px rgba(34,197,94,0.35)'
                        : '0 0 8px 2px rgba(239,68,68,0.35)',
                    }}
                  >
                    {/* Droid image */}
                    <img
                      src={imgSrc(d.name, d.tier)}
                      alt={d.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />

                    {/* Tier label — bottom inside */}
                    <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 bg-black/60">
                      <span
                        className="text-[8px] font-black uppercase tracking-wide"
                        style={{ color: tierColor }}
                      >
                        {d.tier}
                      </span>
                    </div>

                    {/* Check / X circle — top left */}
                    <div
                      className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: have ? '#22c55e' : '#ef4444' }}
                    >
                      {have ? (
                        <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M2 2l6 6M8 2l-6 6" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Name below */}
                  <span className="text-white text-[10px] font-bold w-[76px] text-center truncate">{d.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {open && !nextRebirth && (
        <div className="px-4 pb-3 text-center text-yellow-400 font-bold text-sm">
          🎉 Maximum rebirth level reached!
        </div>
      )}
    </div>
  )
}
