export type Rarity =
  | 'COMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'MYTHIC'
  | 'ICONIC';
export type DroidType = 'WORKER' | 'ASTROMECH' | 'BATTLE';
export type Tier = 'DEFAULT' | 'GOLD' | 'DIAMOND' | 'RAINBOW' | 'BESKAR';
export type TierOrAll = Tier | 'ALL';

export interface Droid {
  name: string;
  rarity: Rarity;
  type: DroidType;
  tiers: Tier[];
  eventLocked?: boolean;
}

export interface DroidCard {
  id: string; // `${name}_${tier}`
  droid: Droid;
  tier: Tier;
}

const ALL_TIERS: Tier[] = ['DEFAULT', 'GOLD', 'DIAMOND', 'RAINBOW', 'BESKAR'];
const DEFAULT_ONLY: Tier[] = ['DEFAULT'];

export const DROIDS: Droid[] = [
  // COMMON
  { name: 'MOUSE', rarity: 'COMMON', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'PIT', rarity: 'COMMON', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'GONK', rarity: 'COMMON', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'CB', rarity: 'COMMON', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R3', rarity: 'COMMON', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R5', rarity: 'COMMON', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R8', rarity: 'COMMON', type: 'ASTROMECH', tiers: ALL_TIERS },
  {
    name: 'IMPERIAL PROBE',
    rarity: 'COMMON',
    type: 'BATTLE',
    tiers: ALL_TIERS,
  },
  { name: 'B1 BATTLE', rarity: 'COMMON', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'DRK-1 PROBE', rarity: 'COMMON', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'ID10', rarity: 'COMMON', type: 'BATTLE', tiers: ALL_TIERS },

  // RARE
  { name: 'BDX EXPLORER', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'ARG', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'SENATE HOVERCAM', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'BU-4D', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'BAL-CORE', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'ROLL-R', rarity: 'RARE', type: 'WORKER', tiers: ALL_TIERS },
  { name: '2BB', rarity: 'RARE', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'A-LT', rarity: 'RARE', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R4', rarity: 'RARE', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R9', rarity: 'RARE', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'B1 SECURITY', rarity: 'RARE', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'NAV-EX', rarity: 'RARE', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'VECT-ARM', rarity: 'RARE', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'HOV-R', rarity: 'RARE', type: 'BATTLE', tiers: ALL_TIERS },

  // EPIC
  { name: 'GROUNDMECH', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'LO', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'AMP WALKER', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'SEN-TRI', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'OPTI-POD', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'GUNRUNNER', rarity: 'EPIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'BB', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R2', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R6', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'TRAK-R', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'ORB-WALKER', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'UTIL-TEC', rarity: 'EPIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'B1 HEAVY', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'B2 SUPER', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'B2 HEAVY', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'STRIKE-ORB', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'HAUL-R', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'LNG-SHOT', rarity: 'EPIC', type: 'BATTLE', tiers: ALL_TIERS },

  // LEGENDARY
  {
    name: 'PROTO-ROLLER',
    rarity: 'LEGENDARY',
    type: 'WORKER',
    tiers: ALL_TIERS,
  },
  {
    name: 'MECHA-DROID',
    rarity: 'LEGENDARY',
    type: 'WORKER',
    tiers: ALL_TIERS,
  },
  {
    name: 'MONO-WALKER',
    rarity: 'LEGENDARY',
    type: 'WORKER',
    tiers: ALL_TIERS,
  },
  { name: 'BB9', rarity: 'LEGENDARY', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'R7', rarity: 'LEGENDARY', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'B2-RP', rarity: 'LEGENDARY', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'CYCLO-GRAV', rarity: 'LEGENDARY', type: 'BATTLE', tiers: ALL_TIERS },
  {
    name: 'OPTI-STRIKE',
    rarity: 'LEGENDARY',
    type: 'BATTLE',
    tiers: ALL_TIERS,
  },

  // MYTHIC
  { name: 'SNOW MOUSE', rarity: 'MYTHIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'RIC', rarity: 'MYTHIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'LOADLIFTER', rarity: 'MYTHIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'LEP', rarity: 'MYTHIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'RIC-1200', rarity: 'MYTHIC', type: 'WORKER', tiers: ALL_TIERS },
  { name: 'DRFT-R', rarity: 'MYTHIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'CYCLENS', rarity: 'MYTHIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'MO-TRAK', rarity: 'MYTHIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'TRI-TEK', rarity: 'MYTHIC', type: 'ASTROMECH', tiers: ALL_TIERS },
  { name: 'IG', rarity: 'MYTHIC', type: 'BATTLE', tiers: ALL_TIERS },
  { name: 'KX', rarity: 'MYTHIC', type: 'BATTLE', tiers: ALL_TIERS },

  // ICONIC (event locked, DEFAULT only)
  {
    name: 'BB8',
    rarity: 'ICONIC',
    type: 'ASTROMECH',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'MISTER BONES',
    rarity: 'ICONIC',
    type: 'BATTLE',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'IG-11 MARSHAL',
    rarity: 'ICONIC',
    type: 'BATTLE',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'DJ-R3X',
    rarity: 'ICONIC',
    type: 'WORKER',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'CB-23',
    rarity: 'ICONIC',
    type: 'ASTROMECH',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'R2-D2',
    rarity: 'ICONIC',
    type: 'ASTROMECH',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'C-3P0',
    rarity: 'ICONIC',
    type: 'WORKER',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
];

export const ALL_CARDS: DroidCard[] = DROIDS.flatMap((droid) =>
  droid.tiers.map((tier) => ({
    id: `${droid.name}_${tier}`,
    droid,
    tier,
  })),
);

export const TOTAL_DROIDS = 317;

export const RARITY_ORDER: Rarity[] = [
  'COMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'MYTHIC',
  'ICONIC',
];
export const TIER_ORDER: Tier[] = [
  'DEFAULT',
  'GOLD',
  'DIAMOND',
  'RAINBOW',
  'BESKAR',
];

export const TIER_BORDER: Record<Tier, string> = {
  DEFAULT: 'border-zinc-600',
  GOLD: 'border-amber-400',
  DIAMOND: 'border-sky-300',
  RAINBOW: 'rainbow-border-animated border-transparent',
  BESKAR: 'beskar-card border-transparent',
};

export const TIER_GLOW: Record<Tier, string> = {
  DEFAULT: '',
  GOLD: '0 0 10px 2px rgba(251,191,36,0.4)',
  DIAMOND: '0 0 10px 2px rgba(147,220,255,0.4)',
  RAINBOW: '0 0 12px 3px rgba(168,85,247,0.4)',
  BESKAR: '',
};
