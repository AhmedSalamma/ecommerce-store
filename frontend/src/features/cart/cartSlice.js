import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_CART_ITEMS } from '@/constants/cart';

const VALID_PROMO_CODES = { SAVE50: 50 };

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: INITIAL_CART_ITEMS,
    discount: 0,
  },
  reducers: {
    addItem(state, action) {
      const { productId, quantity, specLabel } = action.payload;
      const id = `cart-${productId}`;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ id, productId, quantity, specLabel });
      }
    },
    setQuantity(state, action) {
      const { id, quantity } = action.payload;
      if (quantity < 1) return;
      const item = state.items.find((current) => current.id === id);
      if (item) item.quantity = quantity;
    },
    incrementQuantity(state, action) {
      const item = state.items.find((current) => current.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity(state, action) {
      const item = state.items.find((current) => current.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItem(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    applyPromoCode(state, action) {
      const normalized = action.payload.trim().toUpperCase();
      state.discount = VALID_PROMO_CODES[normalized] ?? 0;
    },
    clearCart(state) {
      state.items = [];
      state.discount = 0;
    },
  },
});

export const {
  addItem,
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  applyPromoCode,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
