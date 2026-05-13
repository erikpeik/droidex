import { REBIRTH_LEVELS } from '../data/rebirths'

interface Props {
  rebirthLevel: number
  collected: Set<string>
  onSetRebirth: (level: number) => void
}

const TIER_TEXT: Record<string, string> = {
  DEFAULT: 'text-gray-400',
  GOLD:    'text-amber-400',
  DIAMOND: 'text-sky-300',
  RAINBOW: 'text-purple-400',
}

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_')
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`
}

export function RebirthsPage({ rebirthLevel, collected, onSetRebirth }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Sticky rebirth level selector */}
      <div className="sticky top-0 z-10 bg-black border-b border-zinc-800 px-4 py-2 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => onSetRebirth(Math.max(0, rebirthLevel - 1))}
          disabled={rebirthLevel === 0}
          className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-base font-bold transition-colors"
        >←</button>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-xs uppercase tracking-widest">Current Rebirth</span>
          <span className="text-orange-400 font-black text-xl leading-none w-8 text-center">{rebirthLevel}</span>
          {rebirthLevel >= 20 && <span className="text-yellow-400 text-xs font-bold">MAX</span>}
        </div>
        <button
          type="button"
          onClick={() => onSetRebirth(Math.min(20, rebirthLevel + 1))}
          disabled={rebirthLevel >= 20}
          className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-base font-bold transition-colors"
        >→</button>
      </div>

      {/* Level cards */}
      <div className="max-w-3xl mx-auto px-3 py-3 space-y-3">
      {REBIRTH_LEVELS.map((level) => {
        const isDone = level.to <= rebirthLevel
        const isCurrent = level.from === rebirthLevel
        const allMet = level.droids.every((d) => collected.has(d.cardId))
        const ownedCount = level.droids.filter((d) => collected.has(d.cardId)).length

        return (
          <div
            key={level.from}
            className={`rounded-xl border px-4 py-3 transition-all ${
              isCurrent
                ? 'border-orange-500 bg-zinc-900 shadow-[0_0_10px_2px_rgba(249,115,22,0.2)]'
                : isDone
                ? 'border-zinc-800 bg-zinc-950 opacity-40'
                : 'border-zinc-800 bg-zinc-950'
            }`}
          >
            {/* Row header */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className={`font-black text-sm tracking-widest uppercase ${isCurrent ? 'text-orange-400' : isDone ? 'text-zinc-500' : 'text-zinc-300'}`}>
                Rebirth {level.from} → {level.to}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-yellow-500/40 text-yellow-400 font-bold text-xs">
                {level.credits} credits
              </span>
              <div className="ml-auto">
                {isDone ? (
                  <span className="text-xs font-bold text-zinc-500">✓ DONE</span>
                ) : allMet ? (
                  <span className="text-xs font-bold text-green-400">✓ READY</span>
                ) : (
                  <span className="text-xs font-bold text-red-400">{ownedCount}/{level.droids.length} droids</span>
                )}
              </div>
            </div>

            {/* Droid cards */}
            <div className="flex flex-wrap gap-3">
              {level.droids.map((d) => {
                const have = collected.has(d.cardId)
                return (
                  <div key={d.cardId} className="flex flex-col items-center gap-1">
                    <div
                      className={`relative w-[76px] h-[76px] rounded-xl border-2 overflow-hidden bg-zinc-900 ${
                        isDone
                          ? 'border-zinc-700'
                          : have
                          ? 'border-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.35)]'
                          : 'border-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.35)]'
                      }`}
                    >
                      <img
                        src={imgSrc(d.name, d.tier)}
                        alt={d.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-center py-0.5 bg-black/60">
                        <span className={`text-[8px] font-black uppercase tracking-wide ${TIER_TEXT[d.tier]}`}>
                          {d.tier}
                        </span>
                      </div>
                      {!isDone && (
                        <div
                          className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center ${have ? 'bg-green-500' : 'bg-red-500'}`}
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
                      )}
                    </div>
                    <span className="text-white text-[10px] font-bold w-[76px] text-center truncate">{d.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {rebirthLevel >= 20 && (
        <div className="text-center py-6 text-yellow-400 font-bold text-sm">
          Maximum rebirth level reached!
        </div>
      )}
      </div>
    </div>
  )
}
