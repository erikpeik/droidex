type CollectionStatus = 'ALL' | 'OWNED' | 'MISSING';

interface Props {
  active: CollectionStatus;
  onChange: (s: CollectionStatus) => void;
}

const OPTIONS: { value: CollectionStatus; label: string; color: string }[] = [
  { value: 'ALL', label: 'ALL', color: '#6b7280' },
  { value: 'OWNED', label: 'OWNED', color: '#22d3ee' },
  { value: 'MISSING', label: 'MISSING', color: '#f87171' },
];

export function CollectionFilter({ active, onChange }: Props) {
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
