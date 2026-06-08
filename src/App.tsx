import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ALL_CARDS } from './data/droids';
import type { TierOrAll, DroidType, Rarity, DroidCard as DroidCardType } from './data/droids';
import { useAuth } from './hooks/useAuth';
import { useTracker } from './hooks/useTracker';
import { Header } from './components/Header';
import { TierTabs } from './components/TierTabs';
import { RarityFilter } from './components/RarityFilter';
import { ClassFilter } from './components/ClassFilter';
import { CollectionFilter } from './components/CollectionFilter';
import { SearchInput } from './components/SearchInput';
import { DroidGrid } from './components/DroidGrid';
import { RebirthPanel } from './components/RebirthPanel';
import { RebirthsPage } from './components/RebirthsPage';
import { UntrackConfirmModal } from './components/UntrackConfirmModal';
import { SquadsPage } from './components/SquadsPage';

type RarityOrAll = Rarity | 'ALL';
type DroidTypeOrAll = DroidType | 'ALL';
type CollectionStatus = 'ALL' | 'OWNED' | 'MISSING';

export default function App() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const {
    collected,
    toggle,
    rebirthLevel,
    setRebirthLevel,
    squads,
    assignToSquad,
    clearSquad,
  } = useTracker(user?.uid ?? null);
  const [tier, setTier] = useState<TierOrAll>('ALL');
  const [rarity, setRarity] = useState<RarityOrAll>('ALL');
  const [droidClass, setDroidClass] = useState<DroidTypeOrAll>('ALL');
  const [collectionStatus, setCollectionStatus] =
    useState<CollectionStatus>('ALL');
  const [search, setSearch] = useState('');
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [untrackTarget, setUntrackTarget] = useState<DroidCardType | null>(null);
  const [confirmUntrack, setConfirmUntrack] = useState<boolean>(() => {
    const stored = localStorage.getItem('droidex_confirm_untrack');
    return stored !== 'false';
  });
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleToggle = (id: string) => {
    if (confirmUntrack && collected.has(id)) {
      const card = ALL_CARDS.find((c) => c.id === id);
      if (card) {
        setUntrackTarget(card);
        setDontAskAgain(false);
        return;
      }
    }
    toggle(id);
  };

  const handleConfirmUntrack = () => {
    if (untrackTarget) {
      toggle(untrackTarget.id);
      if (dontAskAgain) {
        setConfirmUntrack(false);
        localStorage.setItem('droidex_confirm_untrack', 'false');
      }
      setUntrackTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <span className="text-cyan-400 text-lg tracking-wider animate-pulse glow-cyan font-bold">
          DROIDEX
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-black flex flex-col lg:overflow-hidden">
      <Header
        collected={collected}
        rebirthLevel={rebirthLevel}
        user={user}
        onSignIn={user ? undefined : signInWithGoogle}
        onSignOut={user ? signOut : undefined}
      />

      <Routes>
        <Route
          path="/"
          element={
            <div className="flex-1 flex flex-col min-h-0">
              <TierTabs active={tier} onChange={setTier} />

              {/* Main panel: grid left + filter sidebar right on desktop */}
              <div className="bg-zinc-950 border border-zinc-800 border-t-0 mx-3 rounded-b-lg flex flex-col lg:flex-row overflow-hidden lg:flex-1 lg:min-h-0">
                {/* Filter sidebar — top on mobile (order-first), right on desktop (lg:order-last) */}
                <aside className="order-first lg:order-last shrink-0 lg:w-72 lg:border-l border-b lg:border-b-0 border-zinc-800 flex flex-col bg-zinc-950">
                  {/* Mobile toggle header */}
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((o) => !o)}
                    className="lg:hidden flex items-center justify-between w-full px-4 py-2.5 text-left"
                  >
                    <span className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">
                      Filters
                    </span>
                    <span className="text-zinc-600 text-sm sm:text-xs">
                      {filtersOpen ? '▲' : '▼'}
                    </span>
                  </button>

                  {/* Filter content: hidden on mobile until toggled, always visible on desktop */}
                  <div
                    className={`${filtersOpen ? 'flex' : 'hidden'} lg:flex flex-col flex-1 lg:overflow-y-auto`}
                  >
                    {/* Rarity */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs font-semibold tracking-wider text-zinc-500 mb-2 uppercase">
                        Rarity
                      </p>
                      <RarityFilter active={rarity} onChange={setRarity} />
                    </div>

                    {/* Class */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs font-semibold tracking-wider text-zinc-500 mb-2 uppercase">
                        Class
                      </p>
                      <ClassFilter
                        active={droidClass}
                        onChange={setDroidClass}
                      />
                    </div>

                    {/* Collection */}
                    <div className="px-4 py-3 border-b border-zinc-800">
                      <p className="text-xs font-semibold tracking-wider text-zinc-500 mb-2 uppercase">
                        Collection
                      </p>
                      <CollectionFilter
                        active={collectionStatus}
                        onChange={setCollectionStatus}
                      />
                    </div>

                    {/* Preferences */}
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold tracking-wider text-zinc-500 mb-2 uppercase">
                        Preferences
                      </p>
                      <div className="flex items-center justify-between bg-zinc-900/20 border border-zinc-900 rounded-lg p-2.5">
                        <span className="text-xs text-zinc-400 font-medium">Confirm Untrack</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = !confirmUntrack;
                            setConfirmUntrack(next);
                            localStorage.setItem('droidex_confirm_untrack', String(next));
                          }}
                          className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded border transition-all duration-100"
                          style={{
                            borderColor: confirmUntrack ? '#22d3ee' : '#4b5563',
                            color: confirmUntrack ? '#000' : '#9ca3af',
                            backgroundColor: confirmUntrack ? '#22d3ee' : 'transparent',
                            boxShadow: confirmUntrack ? '0 0 8px #22d3ee66' : 'none',
                          }}
                        >
                          {confirmUntrack ? 'ON' : 'OFF'}
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Droid grid — scrollable, fills remaining space */}
                <div className="order-last lg:order-first flex-1 flex flex-col min-h-0">
                  <div className="px-3 py-3 sm:py-2 border-b border-zinc-800 shrink-0">
                    <SearchInput value={search} onChange={setSearch} />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <DroidGrid
                      tier={tier}
                      rarity={rarity}
                      droidClass={droidClass}
                      collectionStatus={collectionStatus}
                      search={search}
                      collected={collected}
                      onToggle={handleToggle}
                      highlightedIds={highlightedIds}
                    />
                  </div>
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
          path="/squads"
          element={
            <SquadsPage
              collected={collected}
              rebirthLevel={rebirthLevel}
              squads={squads}
              assignToSquad={assignToSquad}
              clearSquad={clearSquad}
            />
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

      <UntrackConfirmModal
        isOpen={untrackTarget !== null}
        card={untrackTarget}
        rebirthLevel={rebirthLevel}
        onConfirm={handleConfirmUntrack}
        onCancel={() => setUntrackTarget(null)}
        dontAskAgain={dontAskAgain}
        onDontAskAgainChange={setDontAskAgain}
      />
    </div>
  );
}
