import { Link, NavLink } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { TOTAL_DROIDS } from '../data/droids';

interface Props {
  collected: Set<string>;
  rebirthLevel: number;
  user?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export function Header({
  collected,
  rebirthLevel,
  user,
  onSignIn,
  onSignOut,
}: Props) {
  const collectedCount = collected.size;
  const pct = Math.round((collectedCount / TOTAL_DROIDS) * 100);

  return (
    <header className="bg-black border-b border-zinc-800 px-4 py-3 flex items-center gap-4 flex-wrap">
      {/* Title */}
      <Link to="/" className="shrink-0">
        <h1 className="text-2xl font-extrabold tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
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
          `shrink-0 flex items-center gap-2 rounded-lg px-3 h-9 border transition-colors ${
            isActive
              ? 'bg-zinc-900 border-cyan-700 text-cyan-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
          }`
        }
      >
        <span className="text-xs uppercase tracking-wide font-semibold">Collected</span>
        <span className="font-bold text-lg leading-none font-mono">
          {collectedCount}
          <span className="text-[10px] font-normal opacity-60">
            /{TOTAL_DROIDS}
          </span>
        </span>
      </NavLink>

      {/* Squads page link */}
      <NavLink
        to="/squads"
        className={({ isActive }) =>
          `shrink-0 flex items-center gap-2 rounded-lg px-3 h-9 border transition-colors ${
            isActive
              ? 'bg-zinc-900 border-teal-700 text-teal-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
          }`
        }
      >
        <span className="text-xs uppercase tracking-wide font-semibold">Squads</span>
      </NavLink>

      {/* Rebirth badge → rebirths page */}
      <NavLink
        to="/rebirths"
        className={({ isActive }) =>
          `shrink-0 flex items-center gap-2 rounded-lg px-3 h-9 border transition-colors ${
            isActive
              ? 'bg-zinc-900 border-orange-700 text-orange-400'
              : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
          }`
        }
      >
        <span className="text-xs uppercase tracking-wide font-semibold">Rebirth</span>
        <span className="font-bold text-lg leading-none font-mono">{rebirthLevel}</span>
        {rebirthLevel >= 23 && (
          <span className="text-yellow-400 text-xs font-bold ml-1">MAX</span>
        )}
      </NavLink>

      {onSignIn && (
        <button
          className="gsi-material-button shrink-0"
          type="button"
          onClick={onSignIn}
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                ></path>
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                ></path>
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                ></path>
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                ></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">
              Sign in with Google
            </span>
            <span className="hidden">Sign in with Google</span>
          </div>
        </button>
      )}
      {onSignOut && user && (
        <div className="shrink-0 flex items-center gap-1.5">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName ?? 'User'}
              className="w-8 h-8 rounded-full border border-zinc-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-xs font-bold border border-zinc-600">
              {(user.displayName ?? user.email ?? '?')[0].toUpperCase()}
            </div>
          )}
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            className="text-zinc-500 hover:text-zinc-200 transition-colors p-1 rounded"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.047a.75.75 0 1 0-1.06-1.06l-2.25 2.25a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.704 10.75H18.25A.75.75 0 0 0 19 10Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}
