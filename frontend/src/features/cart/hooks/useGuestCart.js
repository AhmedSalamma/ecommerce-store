import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProducts } from '@/features/products/hooks/useProducts';
import { FREE_SHIPPING_THRESHOLD, TAX_RATE } from '@/constants/cart';
import {
  addItem as addItemAction,
  incrementQuantity,
  decrementQuantity,
  removeItem as removeItemAction,
  applyPromoCode as applyPromoCodeAction,
  clearCart as clearCartAction,
} from '@/features/cart/cartSlice';

export function useGuestCart({ enabled }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const discount = useSelector((state) => state.cart.discount);

  const { data } = useProducts(
    { ids: items.map((item) => item.productId).join(',') },
    { enabled: enabled && items.length > 0 }
  );
  const productsById = useMemo(
    () => new Map((data?.products ?? []).map((product) => [product.id, product])),
    [data]
  );

  const lines = useMemo(
    () => items.map((item) => ({ ...item, product: productsById.get(item.productId) })),
    [items, productsById]
  );

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + (line.product?.price ?? 0) * line.quantity, 0),
    [lines]
  );

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
    addItem: (payload) => dispatch(addItemAction(payload)),
    increment: (id) => dispatch(incrementQuantity(id)),
    decrement: (id) => dispatch(decrementQuantity(id)),
    removeItem: (id) => dispatch(removeItemAction(id)),
    applyPromoCode: (code) => dispatch(applyPromoCodeAction(code)),
    clearCart: () => dispatch(clearCartAction()),
  };
}
