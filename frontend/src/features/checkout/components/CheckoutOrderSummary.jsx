import { useState } from 'react';
import { Lock } from 'lucide-react';
import { ProductImage } from '@/components/ui/ProductImage';
import { Button } from '@/components/ui/Button';

function SummaryRow({ label, value, emphasis = false, tone }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span
        className={
          tone === 'success'
            ? 'font-semibold text-green-600'
            : emphasis
              ? 'text-lg font-extrabold text-neutral-900'
              : 'font-semibold text-neutral-900'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function CheckoutOrderSummary({ lines, subtotal, shipping, tax, discount, total, onApplyPromoCode }) {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim()) onApplyPromoCode(code);
  };

  return (
    <div className="w-full rounded-2xl bg-neutral-50 p-6 lg:w-80">
      <h2 className="mb-4 text-lg font-extrabold text-neutral-900">ملخص الطلب</h2>

      <div className="mb-5 space-y-3">
        {lines.map((line) =>
          line.product ? (
            <div key={line.id} className="flex items-center gap-3">
              <ProductImage imageUrl={line.product.image} category={line.product.category} className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-neutral-900">{line.product.name}</p>
                <p className="text-xs text-neutral-400">الكمية: {line.quantity}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-neutral-900">
                {(line.product.price * line.quantity).toLocaleString()}$
              </span>
            </div>
          ) : (
            <div key={line.id} className="h-14 animate-pulse rounded-xl bg-neutral-100" />
          )
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="كود الخصم"
          className="min-w-0 flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button variant="dark" size="sm" onClick={handleApply}>
          تطبيق
        </Button>
      </div>

      <div className="space-y-3">
        <SummaryRow label="المجموع الفرعي" value={`${subtotal.toLocaleString()}$`} />
        <SummaryRow label="الشحن" value={shipping === 0 ? 'مجاني' : `${shipping.toLocaleString()}$`} />
        <SummaryRow label="الضريبة" value={`${tax.toLocaleString()}$`} />
        {discount > 0 && <SummaryRow label="الخصم" value={`-${discount.toLocaleString()}$`} tone="success" />}
      </div>

      <div className="my-4 border-t border-neutral-200" />

      <SummaryRow label="الإجمالي" value={`${total.toLocaleString()}$`} emphasis />

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-neutral-500">
        <Lock size={12} />
        دفع مشفّر وآمن 100%
      </p>
    </div>
  );
}
