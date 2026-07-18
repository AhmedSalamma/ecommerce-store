import { Plus, Minus } from 'lucide-react';

export function QuantityStepper({ quantity, onIncrement, onDecrement }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-neutral-200 px-2 py-1.5">
      <button
        type="button"
        aria-label="إنقاص الكمية"
        onClick={onDecrement}
        className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
      >
        <Minus size={13} />
      </button>
      <span className="w-4 text-center text-sm font-semibold text-neutral-900">{quantity}</span>
      <button
        type="button"
        aria-label="زيادة الكمية"
        onClick={onIncrement}
        className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
