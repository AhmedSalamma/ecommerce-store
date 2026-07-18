import { LayoutGrid, LayoutList, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

const SORT_OPTIONS = [
  { value: 'featured', label: 'مميز' },
  { value: 'price-asc', label: 'السعر: من الأقل للأعلى' },
  { value: 'price-desc', label: 'السعر: من الأعلى للأقل' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];

export function ShopToolbar({ sort, onSortChange, view, onViewChange }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="relative">
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-9 pl-3 text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400" />
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
        <button
          type="button"
          aria-label="عرض شبكي"
          onClick={() => onViewChange('grid')}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            view === 'grid' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
          )}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          type="button"
          aria-label="عرض قائمة"
          onClick={() => onViewChange('list')}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
            view === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
          )}
        >
          <LayoutList size={16} />
        </button>
      </div>
    </div>
  );
}
