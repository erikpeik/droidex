import { useMemo } from 'react';
import { ALL_CARDS, TIER_ORDER } from '../data/droids';
import type { TierOrAll, DroidType, Rarity } from '../data/droids';
import { REBIRTH_LEVELS } from '../data/rebirths';
import { DroidCard } from './DroidCard';

type CollectionStatus = 'ALL' | 'OWNED' | 'MISSING';

interface Props {
  tier: TierOrAll;
  rarity: Rarity | 'ALL';
  droidClass: DroidType | 'ALL';
  collectionStatus: CollectionStatus;
  search: string;
  collected: Set<string>;
  onToggle: (id: string) => void;
  highlightedIds?: Set<string>;
}

export function DroidGrid({
  tier,
  rarity,
  droidClass,
  collectionStatus,
  search,
  collected,
  onToggle,
  highlightedIds,
}: Props) {
  const tierIndex = useMemo(
    () => Object.fromEntries(TIER_ORDER.map((t, i) => [t, i])),
    [],
  );

  const cards = useMemo(() => {
    const filtered = ALL_CARDS.filter((c) => {
      if (tier !== 'ALL' && c.tier !== tier) return false;
      if (rarity !== 'ALL' && c.droid.rarity !== rarity) return false;
      if (droidClass !== 'ALL' && c.droid.type !== droidClass) return false;
      if (collectionStatus === 'OWNED' && !collected.has(c.id)) return false;
      if (collectionStatus === 'MISSING' && collected.has(c.id)) return false;
      if (
        search.trim() &&
        !c.droid.name.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;
      return true;
    });
    if (tier === 'ALL') {
      filtered.sort((a, b) => tierIndex[a.tier] - tierIndex[b.tier]);
    }
    return filtered;
  }, [
    tier,
    rarity,
    droidClass,
    collectionStatus,
    search,
    collected,
    tierIndex,
  ]);

  const rebirthMap = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const level of REBIRTH_LEVELS) {
      for (const d of level.droids) {
        if (!map[d.cardId]) map[d.cardId] = [];
        map[d.cardId].push(level.to);
      }
    }
    return map;
  }, []);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
        No droids match this filter.
      </div>
    );
  }

  return (
    <div
      className="grid gap-3 p-4"
      style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
    >
      {cards.map((card) => (
        <DroidCard
          key={card.id}
          card={card}
          collected={collected.has(card.id)}
          onToggle={onToggle}
          highlighted={highlightedIds?.has(card.id)}
          rebirthLevels={rebirthMap[card.id]}
        />
      ))}
    </div>
  );
}
