import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Tier, Rarity } from './data/droids';
import { useAuth } from './hooks/useAuth';
import { useTracker } from './hooks/useTracker';
import { Header } from './components/Header';
import { TierTabs } from './components/TierTabs';
import { RarityFilter } from './components/RarityFilter';
import { DroidGrid } from './components/DroidGrid';
import { RebirthPanel } from './components/RebirthPanel';
import { RebirthsPage } from './components/RebirthsPage';

type RarityOrAll = Rarity | 'ALL';

export default function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { collected, toggle, rebirthLevel, setRebirthLevel } = useTracker(user?.uid ?? null);
  const [tier, setTier] = useState<Tier>('DEFAULT');
  const [rarity, setRarity] = useState<RarityOrAll>('ALL');
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <span className="text-cyan-400 text-lg tracking-widest animate-pulse glow-cyan">
          DROIDEX
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-mono">
      <Header
        collected={collected}
        rebirthLevel={rebirthLevel}
        onSignIn={user ? undefined : signInWithGoogle}
        onSignOut={user ? signOut : undefined}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col flex-1 overflow-hidden">
              <TierTabs active={tier} onChange={setTier} />
              <div className="bg-zinc-950 border border-zinc-800 border-t-0 mx-3 rounded-b-lg flex flex-col flex-1 overflow-hidden">
                <RarityFilter active={rarity} onChange={setRarity} />
                <div className="overflow-y-auto flex-1">
                  <DroidGrid
                    tier={tier}
                    rarity={rarity}
                    collected={collected}
                    onToggle={toggle}
                    highlightedIds={highlightedIds}
                  />
                </div>
              </div>
              <RebirthPanel
                rebirthLevel={rebirthLevel}
                collected={collected}
                onSetRebirth={setRebirthLevel}
                onHighlight={setHighlightedIds}
              />
            </div>
          }
        />
        <Route
          path="/rebirths"
          element={
            <RebirthsPage
              rebirthLevel={rebirthLevel}
              collected={collected}
              onSetRebirth={setRebirthLevel}
            />
          }
        />
      </Routes>

      <footer className="px-4 py-2 border-t border-zinc-800 bg-black text-center text-xs text-zinc-500">
        Project:{' '}
        <a
          href="https://github.com/erikpeik/droidex"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
        >
          github.com/erikpeik/droidex
        </a>
      </footer>
    </div>
  );
}
