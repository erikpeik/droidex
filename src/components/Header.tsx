import { Link, NavLink } from 'react-router-dom'
import { ALL_CARDS, TOTAL_DROIDS } from '../data/droids'

interface Props {
  collected: Set<string>
  rebirthLevel: number
  onSignIn?: () => void
  onSignOut?: () => void
}

export function Header({ collected, rebirthLevel, onSignIn, onSignOut }: Props) {
  const collectedCount = collected.size
  const knownTotal = ALL_CARDS.length
  const pct = Math.round((collectedCount / TOTAL_DROIDS) * 100)

  return (
    <header className="bg-black border-b border-zinc-800 px-4 py-3 flex items-center gap-4 flex-wrap">
      {/* Title */}
      <Link to="/" className="shrink-0">
        <h1 className="text-2xl font-extrabold tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
          DROIDEX
        </h1>
      </Link>

      {/* Progress bar */}
      <div className="flex-1 min-w-[120px]">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-zinc-600 text-[10px] mt-0.5">{pct}% complete</p>
      </div>

      {/* Collected counter → droids page */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `shrink-0 flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-colors ${
            isActive
              ? 'bg-zinc-900 border-cyan-700 text-cyan-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
          }`
        }
      >
        <span className="text-xs uppercase tracking-wide">Collected</span>
        <span className="font-bold text-lg leading-none">
          {collectedCount}
          <span className="text-[10px] font-normal opacity-60">/{TOTAL_DROIDS}</span>
        </span>
      </NavLink>

      {/* Rebirth badge → rebirths page */}
      <NavLink
        to="/rebirths"
        className={({ isActive }) =>
          `shrink-0 flex items-center gap-2 rounded-lg px-3 py-1.5 border transition-colors ${
            isActive
              ? 'bg-zinc-900 border-orange-700 text-orange-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
          }`
        }
      >
        <span className="text-xs uppercase tracking-wide">Rebirth</span>
        <span className="font-bold text-lg leading-none">{rebirthLevel}</span>
        {rebirthLevel >= 20 && (
          <span className="text-yellow-400 text-xs font-bold ml-1">MAX</span>
        )}
      </NavLink>

      {/* Stat: known droids */}
      <div className="shrink-0 text-[10px] text-zinc-600 hidden sm:block">
        {knownTotal} tracked · {TOTAL_DROIDS - knownTotal} TBD
      </div>

        {onSignIn && (
          <button
            className="gsi-material-button shrink-0"
            type="button"
            onClick={onSignIn}
          >
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="gsi-material-button-contents">Sign in with Google</span>
              <span className="hidden">Sign in with Google</span>
            </div>
          </button>
        )}
        {onSignOut && (
          <button className="gsi-material-button shrink-0" type="button" onClick={onSignOut}>
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper">
              <span className="gsi-material-button-contents">Sign out</span>
            </div>
          </button>
        )}
    </header>
  )
}
