import { useAuth } from '@/features/auth/hooks/useAuth';
import { useGuestCart } from '@/features/cart/hooks/useGuestCart';
import { useServerCart } from '@/features/cart/hooks/useServerCart';

export function useCart() {
  const { isAuthenticated } = useAuth();

  const guestCart = useGuestCart({ enabled: !isAuthenticated });
  const serverCart = useServerCart({ enabled: isAuthenticated });

  return isAuthenticated ? serverCart : guestCart;
}
