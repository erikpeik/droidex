import { useState, useMemo, useEffect } from 'react';
import { Search, AlertTriangle, Check, HelpCircle } from 'lucide-react';
import { ALL_CARDS, Rarity, Tier, DroidType } from '../data/droids';
import { SquadType, SQUAD_DEFINITIONS, getRebirthRequirementsForDroid } from '../data/squads';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface Props {
  isOpen: boolean;
  squadType: SquadType;
  slotIndex: number;
  collected: Set<string>;
  currentRebirthLevel: number;
  onSelect: (cardId: string) => void;
  onClose: () => void;
}

const RARITY_CLASSES: Record<Rarity, string> = {
  COMMON: 'text-green-600 bg-green-600/10 border-green-600/30',
  RARE: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  EPIC: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  LEGENDARY: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  MYTHIC: 'text-red-500 bg-red-500/10 border-red-500/30',
};

const TIER_TEXT: Record<Tier, string> = {
  DEFAULT: 'text-zinc-400 border-zinc-800 bg-zinc-900',
  GOLD: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
  DIAMOND: 'text-sky-300 border-sky-400/30 bg-sky-950/20',
  RAINBOW: 'text-purple-400 border-purple-500/30 bg-purple-950/20',
  BESKAR: 'text-yellow-200 border-yellow-500/30 bg-yellow-950/20',
};

const RARITY_VALUE: Record<Rarity, number> = {
  COMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
  MYTHIC: 5,
};

const TIER_VALUE: Record<Tier, number> = {
  DEFAULT: 1,
  GOLD: 2,
  DIAMOND: 3,
  RAINBOW: 4,
  BESKAR: 5,
};

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`;
}

export function DroidPickerModal({
  isOpen,
  squadType,
  slotIndex,
  collected,
  currentRebirthLevel,
  onSelect,
  onClose,
}: Props) {
  const def = SQUAD_DEFINITIONS[squadType];
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [selectedClass, setSelectedClass] = useState<'ALL' | DroidType>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<'ALL' | Rarity>('ALL');
  const [selectedTier, setSelectedTier] = useState<'ALL' | Tier>('ALL');
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Reset filters when opening
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setShowAll(false);
      setSelectedClass('ALL');
      setSelectedRarity('ALL');
      setSelectedTier('ALL');
      setImgErrors({});
    }
  }, [isOpen]);

  const filteredAndSortedDroids = useMemo(() => {
    // 1. Filter
    const filtered = ALL_CARDS.filter((card) => {
      // Search match
      if (search && !card.droid.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Collected match
      if (!showAll && !collected.has(card.id)) {
        return false;
      }
      // Class match
      if (selectedClass !== 'ALL' && card.droid.type !== selectedClass) {
        return false;
      }
      // Rarity match
      if (selectedRarity !== 'ALL' && card.droid.rarity !== selectedRarity) {
        return false;
      }
      // Tier match
      if (selectedTier !== 'ALL' && card.tier !== selectedTier) {
        return false;
      }
      return true;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      const aReqs = getRebirthRequirementsForDroid(a.id);
      const bReqs = getRebirthRequirementsForDroid(b.id);

      const aNext = aReqs.some((r) => r.rebirthLevel === currentRebirthLevel + 1);
      const bNext = bReqs.some((r) => r.rebirthLevel === currentRebirthLevel + 1);
      if (aNext !== bNext) return aNext ? -1 : 1;

      const aFuture = aReqs.some((r) => r.rebirthLevel > currentRebirthLevel);
      const bFuture = bReqs.some((r) => r.rebirthLevel > currentRebirthLevel);
      if (aFuture !== bFuture) return aFuture ? -1 : 1;

      const aColl = collected.has(a.id);
      const bColl = collected.has(b.id);
      if (aColl !== bColl) return aColl ? -1 : 1;

      const aRarityVal = RARITY_VALUE[a.droid.rarity];
      const bRarityVal = RARITY_VALUE[b.droid.rarity];
      if (aRarityVal !== bRarityVal) return bRarityVal - aRarityVal;

      const aTierVal = TIER_VALUE[a.tier];
      const bTierVal = TIER_VALUE[b.tier];
      if (aTierVal !== bTierVal) return bTierVal - aTierVal;

      return a.droid.name.localeCompare(b.droid.name);
    });
  }, [search, showAll, selectedClass, selectedRarity, selectedTier, collected, currentRebirthLevel]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100 outline-none p-5 rounded-xl shadow-2xl flex flex-col gap-4 max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="gap-0.5 flex flex-col text-left">
          <DialogTitle
            className="text-base font-extrabold tracking-wider uppercase flex items-center gap-2"
            style={{ color: def.themeColor }}
          >
            Assign Droid: {def.name} (Slot {slotIndex + 1})
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            Select a droid to assign. Priority droids required for rebirth milestones are highlighted first.
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col gap-2.5 bg-zinc-900/20 border border-zinc-900 rounded-lg p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search droids by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-all font-medium"
              />
            </div>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 font-medium focus:outline-none focus:border-zinc-700"
            >
              <option value="ALL">All Classes</option>
              <option value="WORKER">Worker</option>
              <option value="ASTROMECH">Astromech</option>
              <option value="BATTLE">Battle</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Rarity & Tier filters */}
            <div className="flex gap-2">
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value as any)}
                className="px-2.5 py-1 text-[10px] rounded border border-zinc-800 bg-zinc-950 text-zinc-400 font-bold focus:outline-none focus:border-zinc-700 uppercase"
              >
                <option value="ALL">All Rarities</option>
                <option value="COMMON">Common</option>
                <option value="RARE">Rare</option>
                <option value="EPIC">Epic</option>
                <option value="LEGENDARY">Legendary</option>
                <option value="MYTHIC">Mythic</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                className="px-2.5 py-1 text-[10px] rounded border border-zinc-800 bg-zinc-950 text-zinc-400 font-bold focus:outline-none focus:border-zinc-700 uppercase"
              >
                <option value="ALL">All Tiers</option>
                <option value="DEFAULT">Base</option>
                <option value="GOLD">Gold</option>
                <option value="DIAMOND">Diamond</option>
                <option value="RAINBOW">Rainbow</option>
                <option value="BESKAR">Beskar</option>
              </select>
            </div>

            {/* Show All Toggle */}
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox
                id="show-all-droids"
                checked={showAll}
                onCheckedChange={(checked) => setShowAll(!!checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-cyan-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-zinc-950 cursor-pointer data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-black"
              />
              <label htmlFor="show-all-droids" className="text-xs text-zinc-400 hover:text-zinc-300 font-semibold cursor-pointer select-none">
                Show uncollected droids
              </label>
            </div>
          </div>
        </div>

        {/* Droid Grid list */}
        <div className="flex-1 overflow-y-auto pr-1 min-h-[250px] max-h-[45vh] border border-zinc-900 rounded-lg p-2 bg-zinc-950/40">
          {filteredAndSortedDroids.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center">
              <HelpCircle className="w-8 h-8 text-zinc-700 mb-2" />
              <p className="text-zinc-500 font-bold text-sm">No droids found</p>
              <p className="text-zinc-600 text-xs mt-0.5">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {filteredAndSortedDroids.map((card) => {
                const isCollected = collected.has(card.id);
                const reqs = getRebirthRequirementsForDroid(card.id);
                const isNeededForNextRebirth = reqs.some((r) => r.rebirthLevel === currentRebirthLevel + 1);
                const isNeededForFutureRebirth = reqs.some((r) => r.rebirthLevel > currentRebirthLevel);
                const hasImgError = imgErrors[card.id];

                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onSelect(card.id)}
                    className={`group relative flex flex-col rounded-lg border-2 bg-zinc-900/60 p-1.5 transition-all hover:scale-95 duration-100 text-left overflow-hidden ${
                      isCollected
                        ? 'border-zinc-800 hover:border-cyan-500/50'
                        : 'border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full rounded-md bg-zinc-950 overflow-hidden mb-1">
                      {!hasImgError ? (
                        <img
                          src={imgSrc(card.droid.name, card.tier)}
                          alt={card.droid.name}
                          onError={() => setImgErrors((prev) => ({ ...prev, [card.id]: true }))}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-600">
                          {card.droid.name.slice(0, 3)}
                        </div>
                      )}

                      {/* Collected Check Icon */}
                      {isCollected && (
                        <div className="absolute top-1 left-1 bg-cyan-400 text-black rounded-full p-0.5 z-10 shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Rebirth Indicator badge */}
                      {isNeededForNextRebirth && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white px-1 py-0.5 rounded-bl border-l border-b border-red-500 animate-pulse flex items-center gap-0.5 z-10">
                          <AlertTriangle className="w-2 h-2" />
                          <span className="text-[7px] font-black uppercase">NEED!</span>
                        </div>
                      )}
                      {!isNeededForNextRebirth && isNeededForFutureRebirth && (
                        <div className="absolute top-0 right-0 bg-amber-500 text-black px-1 py-0.5 rounded-bl font-black text-[7px] uppercase z-10">
                          Keep {reqs.map((r) => r.rebirthLevel).join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Droid details */}
                    <span className="text-white font-bold text-[10px] truncate leading-tight block">
                      {card.droid.name}
                    </span>

                    {/* Badges */}
                    <div className="flex gap-1 mt-1 flex-wrap">
                      <span className={`text-[7px] font-black px-1 py-px rounded-full uppercase border shrink-0 ${RARITY_CLASSES[card.droid.rarity]}`}>
                        {card.droid.rarity}
                      </span>
                      <span className={`text-[7px] font-black px-1 py-px rounded-full uppercase border shrink-0 ${TIER_TEXT[card.tier]}`}>
                        {card.tier}
                      </span>
                    </div>

                    {/* Zebra for Beskar */}
                    {card.tier === 'BESKAR' && <div className="beskar-zebra" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end border-t border-zinc-900 pt-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="px-3.5 py-1.5 h-8 text-[10px] font-bold tracking-wider uppercase rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
