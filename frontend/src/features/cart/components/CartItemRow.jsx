import { X } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';

export function CartItemRow({ line, onIncrement, onDecrement, onRemove }) {
  const { product, quantity, specLabel } = line;

  if (!product) {
    return <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />;
  }

  const lineTotal = product.price * quantity;

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <ProductImage imageUrl={product.image} category={product.category} className="h-20 w-20 shrink-0" />
        <div>
          <p className="text-xs text-neutral-500">{product.brand}</p>
          <h3 className="text-base font-bold text-neutral-900">{product.name}</h3>
          <p className="mt-1 text-xs text-neutral-400">{specLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <QuantityStepper
          quantity={quantity}
          onIncrement={() => onIncrement(line.id)}
          onDecrement={() => onDecrement(line.id)}
        />
        <span className="w-20 text-base font-bold text-neutral-900">{lineTotal.toLocaleString()}$</span>
        <button
          type="button"
          aria-label="إزالة من السلة"
          onClick={() => onRemove(line.id)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
