import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { getCart, addToCart, updateCartItem, removeCartItem } from '@/features/cart/api/cart.service';
import { applyPromoCode as applyPromoCodeAction } from '@/features/cart/cartSlice';
import { FREE_SHIPPING_THRESHOLD, TAX_RATE } from '@/constants/cart';

export function useServerCart({ enabled }) {
  const dispatch = useDispatch();
  const discount = useSelector((state) => state.cart.discount);
  const queryClient = useQueryClient();

  const { data: lines = [] } = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: queryKeys.cart });

  const addMutation = useMutation({ mutationFn: ({ productId, quantity }) => addToCart(productId, quantity), onSuccess: invalidate });
  const updateMutation = useMutation({ mutationFn: ({ id, quantity }) => updateCartItem(id, quantity), onSuccess: invalidate });
  const removeMutation = useMutation({ mutationFn: (id) => removeCartItem(id), onSuccess: invalidate });

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0), [lines]);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 9.99;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = Math.max(subtotal + shipping + tax - discount, 0);

  return {
    lines,
    itemCount,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    addItem: ({ productId, quantity }) => addMutation.mutate({ productId, quantity }),
    increment: (id) => {
      const line = lines.find((item) => item.id === id);
      if (line) updateMutation.mutate({ id, quantity: line.quantity + 1 });
    },
    decrement: (id) => {
      const line = lines.find((item) => item.id === id);
      if (line && line.quantity > 1) updateMutation.mutate({ id, quantity: line.quantity - 1 });
    },
    removeItem: (id) => removeMutation.mutate(id),
    applyPromoCode: (code) => dispatch(applyPromoCodeAction(code)),
    clearCart: () => invalidate(),
  };
}
