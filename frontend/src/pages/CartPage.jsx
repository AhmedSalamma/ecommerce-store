import { useNavigate } from 'react-router-dom';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { OrderSummary } from '@/features/cart/components/OrderSummary';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/features/cart/hooks/useCart';

export function CartPage() {
  const navigate = useNavigate();
  const { lines, subtotal, shipping, tax, discount, total, increment, decrement, removeItem, applyPromoCode } =
    useCart();

  return (
    <div className="container-custom py-8">
      <h1 className="mb-6 text-3xl font-extrabold text-neutral-900">سلة التسوق</h1>

      {lines.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 py-20 text-center">
          <p className="text-sm font-semibold text-neutral-700">سلتك فارغة</p>
          <Button onClick={() => navigate('/shop')} size="sm">
            تصفح المنتجات
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <OrderSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            discount={discount}
            total={total}
            onApplyPromoCode={applyPromoCode}
            onCheckout={() => navigate('/checkout')}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {lines.map((line) => (
              <CartItemRow
                key={line.id}
                line={line}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
