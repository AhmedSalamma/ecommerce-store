import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { addToCart } from '@/features/cart/api/cart.service';
import { clearCart } from '@/features/cart/cartSlice';
import { queryKeys } from '@/api/queryKeys';

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const guestItems = useSelector((state) => state.cart.items);
  const registerMutation = useRegister();

  const handleSubmit = async (data) => {
    try {
      await registerMutation.mutateAsync({
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        password: data.password,
      });

      if (guestItems.length > 0) {
        await Promise.all(guestItems.map((item) => addToCart(item.productId, item.quantity)));
        dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }

      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch {
      // error surfaced below via registerMutation.error
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-neutral-900">إنشاء حساب</h1>
      <p className="mt-1 text-sm text-neutral-500">أنشئ حساباً للوصول إلى طلباتك وقوائم مفضلاتك.</p>

      {registerMutation.isError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {registerMutation.error?.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى'}
        </p>
      )}

      <div className="mt-6">
        <RegisterForm onSubmit={handleSubmit} submitting={registerMutation.isPending} />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        لديك حساب بالفعل؟{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
