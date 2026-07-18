import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ReviewStep({ address, submitting, error, onSubmit, onBack }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-extrabold text-neutral-900">المراجعة والدفع</h2>

      {address && (
        <div className="rounded-xl border border-neutral-200 p-4 text-sm">
          <p className="font-bold text-neutral-900">{address.full_name}</p>
          <p className="mt-1 text-neutral-500">
            {address.street}، {address.city}، {address.country}
          </p>
          <p className="text-neutral-500">{address.phone}</p>
        </div>
      )}

      <div>
        <label htmlFor="order-notes" className="mb-1.5 block text-sm font-medium text-neutral-700">
          ملاحظات الطلب (اختياري)
        </label>
        <textarea
          id="order-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="أي تعليمات إضافية للطلب..."
        />
      </div>

      <div className="rounded-xl bg-neutral-50 p-4 text-sm">
        <p className="font-bold text-neutral-900">طريقة الدفع</p>
        <p className="mt-1 text-neutral-500">الدفع عبر Stripe — سيتم تحويلك لصفحة دفع آمنة.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="button" size="lg" onClick={() => onSubmit(notes)} disabled={submitting}>
          {submitting ? 'جارِ التحويل...' : 'إتمام الطلب والدفع'}
        </Button>
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="gap-1" disabled={submitting}>
          <ArrowRight size={16} />
          رجوع
        </Button>
      </div>
    </div>
  );
}
