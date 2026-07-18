import { X } from 'lucide-react';

export function ActiveFilterChips({ chips, onClearAll }) {
  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white py-1.5 pr-3 pl-2 text-xs font-medium text-neutral-700"
        >
          {chip.label}
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label="إزالة الفلتر"
            className="flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={11} />
          </button>
        </span>
      ))}

      <button type="button" onClick={onClearAll} className="text-xs font-semibold text-primary hover:underline">
        إزالة الكل
      </button>
    </div>
  );
}
