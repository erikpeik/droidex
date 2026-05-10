import { useState } from 'react'
import type { DroidCard as DroidCardType } from '../data/droids'

interface Props {
  card: DroidCardType
  collected: boolean
  onToggle: (id: string) => void
  highlighted?: boolean // used by rebirth panel hover
}

const RARITY_COLORS: Record<string, string> = {
  COMMON:    '#9ca3af',
  RARE:      '#3b82f6',
  EPIC:      '#a855f7',
  LEGENDARY: '#f59e0b',
  MYTHIC:    '#ef4444',
}

const TYPE_CONFIG: Record<string, { bg: string; shape: string; label: string }> = {
  WORKER:    { bg: 'from-amber-900/60 to-amber-950/80',   shape: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)', label: '⚙' },
  ASTROMECH: { bg: 'from-sky-900/60 to-sky-950/80',       shape: '50%',                                                        label: '◉' },
  BATTLE:    { bg: 'from-red-900/60 to-red-950/80',       shape: 'polygon(50% 0%,100% 38%,82% 100%,18% 100%,0% 38%)',         label: '⚡' },
}

const TIER_STYLES: Record<string, { border: string; badge: string; glow: string }> = {
  DEFAULT:  { border: 'border-zinc-700',        badge: '',                                         glow: '' },
  GOLD:     { border: 'border-amber-400',        badge: 'bg-amber-400 text-black',                  glow: '0 0 10px 2px rgba(251,191,36,0.5)' },
  DIAMOND:  { border: 'border-sky-300',          badge: 'bg-sky-300 text-black',                    glow: '0 0 10px 2px rgba(147,220,255,0.5)' },
  RAINBOW:  { border: 'border-transparent',      badge: 'text-white rainbow-badge',                 glow: '0 0 12px 3px rgba(168,85,247,0.5)' },
}

function initials(name: string): string {
  const parts = name.split(/[\s-]+/)
  if (parts.length === 1) return name.slice(0, 2).toUpperCase()
  return parts.map((p) => p[0]).join('').slice(0, 3).toUpperCase()
}

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_')
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`
}

export function DroidCard({ card, collected, onToggle, highlighted }: Props) {
  const { droid, tier, id } = card
  const rarityColor = RARITY_COLORS[droid.rarity]
  const typeConfig = TYPE_CONFIG[droid.type]
  const tierStyle = TIER_STYLES[tier]
  const isRainbow = tier === 'RAINBOW'
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <button
      onClick={() => onToggle(id)}
      title={`${droid.name} (${tier}) — click to toggle`}
      className={[
        'relative flex flex-col items-center rounded-lg border-2 transition-all duration-150 select-none',
        'bg-zinc-900 hover:bg-zinc-800 active:scale-95 cursor-pointer overflow-hidden',
        tierStyle.border,
        collected ? 'ring-2 ring-cyan-400' : '',
        highlighted ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-black' : '',
      ].join(' ')}
      style={{
        boxShadow: collected
          ? '0 0 10px 2px rgba(0,229,255,0.4)'
          : (tierStyle.glow ? tierStyle.glow : undefined),
        borderImage: isRainbow
          ? 'linear-gradient(135deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa,#f472b6) 1'
          : undefined,
      }}
    >
      {/* Rarity top stripe */}
      <div className="w-full h-1" style={{ backgroundColor: rarityColor }} />

      {/* Droid image or fallback icon */}
      <div className={`w-full flex-1 flex items-center justify-center bg-gradient-to-b ${typeConfig.bg} min-h-[4rem] overflow-hidden`}>
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
            className="w-12 h-12 flex items-center justify-center text-2xl font-bold"
            style={{
              clipPath: typeConfig.shape === '50%' ? undefined : typeConfig.shape,
              borderRadius: typeConfig.shape === '50%' ? '50%' : undefined,
              backgroundColor: rarityColor + '33',
              border: `1px solid ${rarityColor}66`,
              color: rarityColor,
            }}
          >
            {initials(droid.name)}
          </div>
        )}
      </div>

      {/* Name + meta */}
      <div className="w-full px-1.5 pb-1.5 pt-1 text-center">
        <p className="text-white font-bold text-[10px] leading-tight truncate">{droid.name}</p>
        <p className="text-zinc-500 text-[8px] uppercase tracking-wide">{droid.type}</p>
      </div>

      {/* Tier badge (non-default) */}
      {tier !== 'DEFAULT' && (
        <div
          className={[
            'absolute top-2 right-1.5 text-[7px] font-bold px-1 py-0.5 rounded uppercase tracking-wider',
            tierStyle.badge,
          ].join(' ')}
          style={isRainbow ? { background: 'linear-gradient(135deg,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#a78bfa)' } : undefined}
        >
          {tier[0]}
        </div>
      )}

      {/* Collected checkmark */}
      {collected && (
        <div className="absolute top-1 left-1.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center">
          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1.5 5l2.5 2.5 4.5-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Event locked overlay */}
      {droid.eventLocked && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-red-400 text-[9px] font-bold text-center leading-tight px-1">EVENT<br />LOCKED</span>
        </div>
      )}
    </button>
  )
}
