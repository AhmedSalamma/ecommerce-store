import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Modal({ open, onClose, title, children, className }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} />
      <div
        className={cn(
          'relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl',
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
