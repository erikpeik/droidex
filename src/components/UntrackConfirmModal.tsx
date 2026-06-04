import { useMemo, useState, useEffect } from 'react';
import type { DroidCard as DroidCardType } from '../data/droids';
import { REBIRTH_LEVELS } from '../data/rebirths';
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
  card: DroidCardType | null;
  rebirthLevel: number;
  onConfirm: () => void;
  onCancel: () => void;
  dontAskAgain: boolean;
  onDontAskAgainChange: (val: boolean) => void;
}

const RARITY_CLASS: Record<string, string> = {
  COMMON: 'text-green-600 bg-green-600/15 border border-green-600/40',
  RARE: 'text-blue-500 bg-blue-500/15 border border-blue-500/40',
  EPIC: 'text-purple-500 bg-purple-500/15 border border-purple-500/40',
  LEGENDARY: 'text-amber-400 bg-amber-400/15 border border-amber-400/40',
  MYTHIC: 'text-red-500 bg-red-500/15 border border-red-500/40',
};

const TIER_TEXT: Record<string, string> = {
  DEFAULT: 'text-zinc-400',
  GOLD: 'text-amber-400',
  DIAMOND: 'text-sky-300',
  RAINBOW: 'text-purple-400',
  BESKAR: 'text-zinc-100',
};

function imgSrc(name: string, tier: string): string {
  const safe = name.replace(/ /g, '_');
  return `${import.meta.env.BASE_URL}droids/${safe}_${tier}.png`;
}

export function UntrackConfirmModal({
  isOpen,
  card,
  rebirthLevel,
  onConfirm,
  onCancel,
  dontAskAgain,
  onDontAskAgainChange,
}: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (card) {
      setImgFailed(false);
    }
  }, [card]);

  const isRequiredForNextRebirth = useMemo(() => {
    if (!card) return false;
    const nextRebirth = REBIRTH_LEVELS.find((r) => r.from === rebirthLevel);
    return nextRebirth?.droids.some((d) => d.cardId === card.id) ?? false;
  }, [card, rebirthLevel]);

  if (!card) return null;

  const { droid, tier } = card;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent 
        showCloseButton={true}
        className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100 outline-none p-5 rounded-xl shadow-2xl flex flex-col gap-4"
      >
        {/* Header */}
        <DialogHeader className="gap-1 flex flex-col text-left">
          <DialogTitle
            id="untrack-modal-title"
            className="text-base font-extrabold tracking-wider text-red-500 uppercase flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
          >
            ⚠️ Confirm Untrack
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 mt-1">
            Are you sure you want to remove this droid from your collection?
          </DialogDescription>
        </DialogHeader>

        {/* Droid preview card */}
        <div className="flex items-center gap-4 bg-zinc-900/40 border border-zinc-900 rounded-lg p-3">
          <div className="relative w-16 h-16 rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900 shrink-0">
            {!imgFailed ? (
              <img
                src={imgSrc(droid.name, tier)}
                alt={droid.name}
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 text-xs font-bold">
                {droid.type[0]}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-bold text-sm truncate">
              {droid.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                className={`${RARITY_CLASS[droid.rarity]} text-[9px] font-bold px-1.5 py-px rounded uppercase tracking-wide`}
              >
                {droid.rarity}
              </span>
              <span
                className={`${TIER_TEXT[tier]} text-[9px] font-bold px-1.5 py-px rounded bg-zinc-800/80 border border-zinc-700 uppercase tracking-wide`}
              >
                {tier}
              </span>
            </div>
          </div>
        </div>

        {/* Rebirth warning details */}
        {isRequiredForNextRebirth && (
          <div className="bg-orange-950/20 border border-orange-500/30 text-orange-400 text-xs rounded-lg p-3 flex gap-2.5 items-start">
            <span className="text-sm leading-none mt-0.5">⚠️</span>
            <div>
              <p className="font-bold uppercase tracking-wider text-[10px]">
                Required for Rebirth {rebirthLevel} → {rebirthLevel + 1}
              </p>
              <p className="text-zinc-500 mt-0.5 text-[11px] leading-relaxed">
                This droid is needed for your next Rebirth milestone. Untracking it will lower your progress counter.
              </p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-1 flex-wrap gap-3">
          <div className="flex items-center gap-2 cursor-pointer select-none">
            <Checkbox
              id="dont-ask-again"
              checked={dontAskAgain}
              onCheckedChange={(checked) => onDontAskAgainChange(!!checked)}
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-cyan-400 focus-visible:ring-cyan-500 focus-visible:ring-offset-zinc-950 transition-all cursor-pointer data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:text-black"
            />
            <label htmlFor="dont-ask-again" className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors cursor-pointer select-none">
              Don't ask again
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="px-3.5 py-1.5 h-8 text-[10px] font-bold tracking-wider uppercase rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="px-3.5 py-1.5 h-8 text-[10px] font-bold tracking-wider uppercase rounded bg-red-950 border border-red-500/40 text-red-400 hover:bg-red-600 hover:text-black hover:border-red-500 transition-all duration-150"
              style={{
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.1)',
              }}
            >
              Untrack
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
