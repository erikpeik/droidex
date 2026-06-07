import { useState } from 'react';
import { Star, Coffee, Wrench, Cpu, Shield, Trash2, ArrowRight } from 'lucide-react';
import { SquadType, SQUAD_DEFINITIONS, getMaxSlots, getUnlockLevel } from '../data/squads';
import { SquadSlot } from './SquadSlot';
import { DroidPickerModal } from './DroidPickerModal';

interface Props {
  collected: Set<string>;
  rebirthLevel: number;
  squads: Record<SquadType, (string | null)[]>;
  assignToSquad: (squadType: SquadType, slotIndex: number, cardId: string | null) => void;
  clearSquad: (squadType: SquadType) => void;
}

const SQUAD_ICONS: Record<SquadType, any> = {
  COMPANION: Star,
  LOUNGE: Coffee,
  WORKER: Wrench,
  ASTROMECH: Cpu,
  BATTLE: Shield,
};

export function SquadsPage({
  collected,
  rebirthLevel,
  squads,
  assignToSquad,
  clearSquad,
}: Props) {
  const [pickerState, setPickerState] = useState<{
    squadType: SquadType;
    slotIndex: number;
  } | null>(null);

  const handleSelectSlot = (squadType: SquadType, slotIndex: number) => {
    setPickerState({ squadType, slotIndex });
  };

  const handleAssignDroid = (cardId: string) => {
    if (pickerState) {
      assignToSquad(pickerState.squadType, pickerState.slotIndex, cardId);
      setPickerState(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-950 overflow-y-auto px-4 py-6">
      {/* Title / Hero section */}
      <div className="max-w-6xl mx-auto w-full mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-wider text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)] uppercase">
            Squad Management
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Build your team, reserve rebirth requirements in the lounge, and monitor your squad upgrades.
          </p>
        </div>

        {/* Current Rebirth Level badge */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
              Current Rebirth
            </p>
            <p className="text-lg font-bold text-orange-400 font-mono mt-0.5 leading-none">
              Level {rebirthLevel}
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-700" />
          <div className="text-left">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">
              Milestone Reward
            </p>
            <p className="text-xs font-bold text-zinc-400 mt-0.5 leading-none">
              {rebirthLevel < 20 ? 'Unlock squad slot' : 'Max slots achieved'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Squad Grid */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Companion & Lounge (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Companion card */}
          {renderSquadSection('COMPANION')}

          {/* Lounge card */}
          {renderSquadSection('LOUNGE')}
        </div>

        {/* Right Column: Workers, Astromechs, Battles (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Worker Squad card */}
          {renderSquadSection('WORKER')}

          {/* Astromech Squad card */}
          {renderSquadSection('ASTROMECH')}

          {/* Battle Squad card */}
          {renderSquadSection('BATTLE')}
        </div>
      </div>

      {/* Droid Picker Modal */}
      {pickerState && (
        <DroidPickerModal
          isOpen={true}
          squadType={pickerState.squadType}
          slotIndex={pickerState.slotIndex}
          collected={collected}
          currentRebirthLevel={rebirthLevel}
          onSelect={handleAssignDroid}
          onClose={() => setPickerState(null)}
        />
      )}
    </div>
  );

  function renderSquadSection(squadType: SquadType) {
    const def = SQUAD_DEFINITIONS[squadType];
    const Icon = SQUAD_ICONS[squadType];
    const slots = squads[squadType] || [];
    const maxSlots = getMaxSlots(squadType, rebirthLevel);
    const assignedCount = slots.slice(0, maxSlots).filter((id) => id !== null).length;

    return (
      <div
        key={squadType}
        className="rounded-xl border border-zinc-800 bg-zinc-900/10 backdrop-blur-md p-5 flex flex-col gap-4 shadow-xl hover:border-zinc-700/50 transition-colors"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-900 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800"
              style={{
                backgroundColor: `${def.themeColor}10`,
                borderColor: `${def.themeColor}30`,
              }}
            >
              <Icon className="w-4 h-4" style={{ color: def.themeColor }} />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                {def.name}
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                {assignedCount} / {maxSlots} Slots Assigned
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear Button */}
            {assignedCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Clear all slots in ${def.name}?`)) {
                    clearSquad(squadType);
                  }
                }}
                title="Clear all assignments"
                className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-red-400 hover:border-red-950 hover:bg-red-950/15 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            
            {/* Max slot limit notice */}
            {def.maxSlots > def.baseSlots && (
              <span className="text-[9px] font-black text-zinc-600 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded uppercase tracking-wider">
                Max {def.maxSlots}
              </span>
            )}
          </div>
        </div>

        {/* Squad Description */}
        <p className="text-xs text-zinc-400 font-medium leading-relaxed">
          {def.description}
        </p>

        {/* Slot Grid list */}
        <div className="flex flex-wrap gap-3.5 justify-center sm:justify-start pt-1">
          {slots.map((cardId, idx) => {
            const isLocked = idx >= maxSlots;
            const unlockLevel = getUnlockLevel(squadType, idx);

            return (
              <SquadSlot
                key={idx}
                cardId={cardId}
                squadType={squadType}
                slotIndex={idx}
                isLocked={isLocked}
                unlockLevel={unlockLevel}
                currentRebirthLevel={rebirthLevel}
                onSelect={() => handleSelectSlot(squadType, idx)}
                onRemove={() => assignToSquad(squadType, idx, null)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
