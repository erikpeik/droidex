export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
export type DroidType = 'WORKER' | 'ASTROMECH' | 'BATTLE';
export type Tier = 'DEFAULT' | 'GOLD' | 'DIAMOND' | 'RAINBOW';
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

const ALL_TIERS: Tier[] = ['DEFAULT', 'GOLD', 'DIAMOND', 'RAINBOW'];
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

  // MYTHIC (event locked, DEFAULT only)
  {
    name: 'BB8',
    rarity: 'MYTHIC',
    type: 'ASTROMECH',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'MISTER BONES',
    rarity: 'MYTHIC',
    type: 'BATTLE',
    tiers: DEFAULT_ONLY,
    eventLocked: true,
  },
  {
    name: 'IG-11 MARSHAL',
    rarity: 'MYTHIC',
    type: 'BATTLE',
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

export const TOTAL_DROIDS = 207;

export const RARITY_ORDER: Rarity[] = [
  'COMMON',
  'RARE',
  'EPIC',
  'LEGENDARY',
  'MYTHIC',
];
export const TIER_ORDER: Tier[] = ['DEFAULT', 'GOLD', 'DIAMOND', 'RAINBOW'];
