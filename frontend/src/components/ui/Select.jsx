import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Select = forwardRef(function Select({ label, error, className, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={cn(
            'w-full appearance-none rounded-lg border bg-white px-3.5 py-2.5 pr-9 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30',
            error ? 'border-red-400' : 'border-neutral-200',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400" />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
