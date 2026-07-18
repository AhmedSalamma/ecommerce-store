import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CheckoutCancelPage() {
  return (
    <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
      <XCircle size={48} className="text-red-500" />
      <h1 className="text-2xl font-extrabold text-neutral-900">تم إلغاء عملية الدفع</h1>
      <p className="max-w-sm text-sm text-neutral-500">لم تتم عملية الدفع. سلتك ما زالت محفوظة ويمكنك المحاولة مرة أخرى.</p>
      <div className="mt-2 flex gap-3">
        <Button as={Link} to="/cart" size="sm">
          العودة إلى السلة
        </Button>
        <Button as={Link} to="/" variant="outline" size="sm">
          العودة إلى الرئيسية
        </Button>
      </div>
    </div>
  );
}
