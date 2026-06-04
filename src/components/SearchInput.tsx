import { X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function SearchInput({ value, onChange }: Props) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH DROIDS..."
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-base font-medium tracking-wide text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 transition-colors"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
