import { REBIRTH_LEVELS } from './rebirths';

export type SquadType = 'COMPANION' | 'LOUNGE' | 'WORKER' | 'ASTROMECH' | 'BATTLE';

export type SquadAssignments = Record<SquadType, (string | null)[]>;

export const SQUAD_TYPES: SquadType[] = ['COMPANION', 'LOUNGE', 'WORKER', 'ASTROMECH', 'BATTLE'];

export interface SquadDefinition {
  type: SquadType;
  name: string;
  baseSlots: number;
  maxSlots: number;
  description: string;
  themeColor: string; // Tailwind color name or hex
}

export const SQUAD_DEFINITIONS: Record<SquadType, SquadDefinition> = {
  COMPANION: {
    type: 'COMPANION',
    name: 'Companion Droid',
    baseSlots: 1,
    maxSlots: 1,
    description: 'Your loyal companion droid accompanying you on your adventures.',
    themeColor: '#22d3ee', // Cyan
  },
  LOUNGE: {
    type: 'LOUNGE',
    name: 'Droid Lounge',
    baseSlots: 5,
    maxSlots: 9,
    description: 'A place to park droids, including those you need to save for upcoming rebirths.',
    themeColor: '#fbbf24', // Amber
  },
  WORKER: {
    type: 'WORKER',
    name: 'Worker Squad',
    baseSlots: 4,
    maxSlots: 11, // 4 base + 7 unlocks (at 1, 4, 7, 10, 12, 14, 16)
    description: 'Droids working hard to generate income.',
    themeColor: '#16a34a', // Green
  },
  ASTROMECH: {
    type: 'ASTROMECH',
    name: 'Astromech Squad',
    baseSlots: 3,
    maxSlots: 9, // 3 base + 6 unlocks (at 2, 5, 8, 11, 13, 15)
    description: 'Astromechs assisting with ships, computing, and tech systems.',
    themeColor: '#7c3aed', // Purple
  },
  BATTLE: {
    type: 'BATTLE',
    name: 'Battle Squad',
    baseSlots: 2,
    maxSlots: 5, // 2 base + 3 unlocks (at 3, 6, 9)
    description: 'Combat-ready battle droids.',
    themeColor: '#dc2626', // Red
  },
};

// Map representing the rebirth level required to unlock a slot for each squad
// index 0 corresponds to slot index `baseSlots` (first unlockable slot)
export const SQUAD_SLOT_UNLOCKS: Record<SquadType, number[]> = {
  COMPANION: [],
  LOUNGE: [17, 18, 19, 20],
  WORKER: [1, 4, 7, 10, 12, 14, 16], // 1st unlock at rebirth 1, 2nd at 4, etc.
  ASTROMECH: [2, 5, 8, 11, 13, 15],
  BATTLE: [3, 6, 9],
};

export function getMaxSlots(squadType: SquadType, rebirthLevel: number): number {
  const def = SQUAD_DEFINITIONS[squadType];
  const unlocks = SQUAD_SLOT_UNLOCKS[squadType];
  if (!unlocks.length) return def.baseSlots;

  const unlockedCount = unlocks.filter((lvl) => rebirthLevel >= lvl).length;
  return def.baseSlots + unlockedCount;
}

/**
 * Returns the rebirth level at which the slot at `slotIndex` unlocks,
 * or null if it's already unlocked from start or never unlocks.
 */
export function getUnlockLevel(squadType: SquadType, slotIndex: number): number | null {
  const def = SQUAD_DEFINITIONS[squadType];
  if (slotIndex < def.baseSlots) return null; // Always unlocked

  const unlocks = SQUAD_SLOT_UNLOCKS[squadType];
  const unlockIndex = slotIndex - def.baseSlots;
  return unlockIndex < unlocks.length ? unlocks[unlockIndex] : null;
}

export interface RebirthRequirementInfo {
  rebirthLevel: number;
  credits: string;
}

/**
 * Finds all rebirth levels that require a specific droid card.
 */
export function getRebirthRequirementsForDroid(cardId: string): RebirthRequirementInfo[] {
  const requirements: RebirthRequirementInfo[] = [];
  for (const level of REBIRTH_LEVELS) {
    if (level.droids.some((d) => d.cardId === cardId)) {
      requirements.push({
        rebirthLevel: level.to,
        credits: level.credits,
      });
    }
  }
  return requirements;
}

export function getSquadUnlockDescription(rebirthLevel: number): string | null {
  if (rebirthLevel === 1) return '+1 Worker Slot';
  if (rebirthLevel === 2) return '+1 Astromech Slot';
  if (rebirthLevel === 3) return '+1 Battle Slot';
  if (rebirthLevel === 4) return '+1 Worker Slot';
  if (rebirthLevel === 5) return '+1 Astromech Slot';
  if (rebirthLevel === 6) return '+1 Battle Slot';
  if (rebirthLevel === 7) return '+1 Worker Slot';
  if (rebirthLevel === 8) return '+1 Astromech Slot';
  if (rebirthLevel === 9) return '+1 Battle Slot';
  if (rebirthLevel === 10) return '+1 Worker Slot';
  if (rebirthLevel === 11) return '+1 Astromech Slot';
  if (rebirthLevel === 12) return '+1 Worker Slot';
  if (rebirthLevel === 13) return '+1 Astromech Slot';
  if (rebirthLevel === 14) return '+1 Worker Slot';
  if (rebirthLevel === 15) return '+1 Astromech Slot';
  if (rebirthLevel === 16) return '+1 Worker Slot';
  if (rebirthLevel === 17) return '+1 Lounge Slot';
  if (rebirthLevel === 18) return '+1 Lounge Slot';
  if (rebirthLevel === 19) return '+1 Lounge Slot';
  if (rebirthLevel === 20) return '+1 Lounge Slot';
  return null;
}
