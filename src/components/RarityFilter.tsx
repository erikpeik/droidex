import type { Rarity } from '../data/droids';

type RarityOrAll = Rarity | 'ALL';

interface Props {
  active: RarityOrAll;
  onChange: (r: RarityOrAll) => void;
}

const OPTIONS: { value: RarityOrAll; label: string; color: string }[] = [
  { value: 'ALL', label: 'ALL', color: '#6b7280' },
  { value: 'COMMON', label: 'COMMON', color: '#16a34a' },
  { value: 'RARE', label: 'RARE', color: '#3b82f6' },
  { value: 'EPIC', label: 'EPIC', color: '#a855f7' },
  { value: 'LEGENDARY', label: 'LEGENDARY', color: '#f59e0b' },
  { value: 'MYTHIC', label: 'MYTHIC', color: '#ef4444' },
];

export function RarityFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-2.5 py-1 sm:py-0.5 text-xs sm:text-[10px] font-bold tracking-widest rounded-full border transition-all duration-100"
            style={{
              borderColor: opt.color,
              color: isActive ? '#000' : opt.color,
              backgroundColor: isActive ? opt.color : 'transparent',
              boxShadow: isActive ? `0 0 8px ${opt.color}88` : 'none',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
