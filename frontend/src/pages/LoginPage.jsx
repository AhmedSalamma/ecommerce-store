import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { addToCart } from '@/features/cart/api/cart.service';
import { clearCart } from '@/features/cart/cartSlice';
import { queryKeys } from '@/api/queryKeys';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const guestItems = useSelector((state) => state.cart.items);
  const loginMutation = useLogin();

  const handleSubmit = async (data) => {
    try {
      await loginMutation.mutateAsync({ email: data.email, password: data.password });

      if (guestItems.length > 0) {
        await Promise.all(guestItems.map((item) => addToCart(item.productId, item.quantity)));
        dispatch(clearCart());
        queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      }

      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch {
      // error surfaced below via loginMutation.error
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-neutral-900">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-neutral-500">مرحباً بعودتك، أدخل بياناتك للمتابعة.</p>

      {loginMutation.isError && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {loginMutation.error?.response?.data?.message ?? 'حدث خطأ، حاول مرة أخرى'}
        </p>
      )}

      <div className="mt-6">
        <LoginForm onSubmit={handleSubmit} submitting={loginMutation.isPending} />
      </div>

      <p className="mt-6 text-center text-sm text-neutral-500">
        ليس لديك حساب؟{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          إنشاء حساب
        </Link>
      </p>
    </div>
  );
}
