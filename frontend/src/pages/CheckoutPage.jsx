import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CheckoutStepper } from '@/features/checkout/components/CheckoutStepper';
import { AddressStep } from '@/features/checkout/components/AddressStep';
import { ReviewStep } from '@/features/checkout/components/ReviewStep';
import { CheckoutOrderSummary } from '@/features/checkout/components/CheckoutOrderSummary';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';
import { useShippingPrices } from '@/features/checkout/hooks/useShippingPrices';

export function CheckoutPage() {
  const navigate = useNavigate();
  const cart = useCart();
  const { data: shippingPrices } = useShippingPrices();
  const checkoutMutation = useCheckout();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(null);

  const shippingCost = address
    ? (shippingPrices?.find((price) => price.area_name === address.city)?.price ?? 0)
    : cart.shipping;
  const total = Math.max(cart.subtotal + Number(shippingCost) + cart.tax - cart.discount, 0);

  const handleSelectAddress = (selected) => {
    setAddress(selected);
    setStep(2);
  };

  const handlePlaceOrder = async (notes) => {
    try {
      const result = await checkoutMutation.mutateAsync({ addressId: address.id, notes });
      window.location.href = result.session_url;
    } catch {
      // error surfaced below via checkoutMutation.error
    }
  };

  if (cart.lines.length === 0) {
    return (
      <div className="container-custom flex flex-col items-center justify-center gap-3 py-24 text-center">
        <p className="text-sm font-semibold text-neutral-700">سلتك فارغة، لا يوجد ما يمكن إتمام طلبه</p>
        <Button onClick={() => navigate('/shop')} size="sm">
          تصفح المنتجات
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <CheckoutStepper currentStep={step} />

      <div className="flex flex-col gap-8 lg:flex-row">
        <CheckoutOrderSummary
          lines={cart.lines}
          subtotal={cart.subtotal}
          shipping={Number(shippingCost)}
          tax={cart.tax}
          discount={cart.discount}
          total={total}
          onApplyPromoCode={cart.applyPromoCode}
        />

        <div className="min-w-0 flex-1">
          {step === 1 && <AddressStep onSelect={handleSelectAddress} />}

          {step === 2 && (
            <ReviewStep
              address={address}
              submitting={checkoutMutation.isPending}
              error={checkoutMutation.error?.response?.data?.message}
              onSubmit={handlePlaceOrder}
              onBack={() => setStep(1)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
