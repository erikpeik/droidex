import type { DroidType } from '../data/droids';

type DroidTypeOrAll = DroidType | 'ALL';

interface Props {
  active: DroidTypeOrAll;
  onChange: (c: DroidTypeOrAll) => void;
}

const OPTIONS: { value: DroidTypeOrAll; label: string; color: string }[] = [
  { value: 'ALL', label: 'ALL', color: '#6b7280' },
  { value: 'WORKER', label: 'WORKER', color: '#16a34a' },
  { value: 'ASTROMECH', label: 'ASTROMECH', color: '#7c3aed' },
  { value: 'BATTLE', label: 'BATTLE', color: '#dc2626' },
];

export function ClassFilter({ active, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {OPTIONS.map((opt) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-2.5 py-1.5 text-xs font-semibold tracking-wide rounded-md border transition-all duration-100 text-center"
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
