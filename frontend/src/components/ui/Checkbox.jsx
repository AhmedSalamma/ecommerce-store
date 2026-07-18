import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Checkbox({ checked, onChange, label, count, className }) {
  return (
    <label className={cn('flex cursor-pointer items-center justify-between gap-2 py-1.5', className)}>
      <span className="flex items-center gap-2">
        <span
          className={cn(
            'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
            checked ? 'border-primary bg-primary' : 'border-neutral-300 bg-white'
          )}
        >
          {checked && <Check size={11} className="text-white" strokeWidth={3} />}
        </span>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <span className="text-sm text-neutral-700">{label}</span>
      </span>
      {count != null && <span className="text-xs text-neutral-400">{count}</span>}
    </label>
  );
}
