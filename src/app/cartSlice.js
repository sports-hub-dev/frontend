import { createSlice } from "@reduxjs/toolkit";

const CART_STORAGE_KEY = "sportshub_cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable — cart simply won't persist across reloads
  }
};

const findIndex = (items, { productId, size }) =>
  items.findIndex((i) => i.productId === productId && (i.size || null) === (size || null));

const initialState = {
  items: loadCart(),
  promo: null, // { code, discountPercentage } — set by PromoCodeInput
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const { productId, name, mainImage, size, price, quantity } = action.payload;
      const idx = findIndex(state.items, { productId, size });
      if (idx > -1) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({ productId, name, mainImage, size: size || null, price, quantity });
      }
      persistCart(state.items);
    },
    updateQuantity(state, action) {
      const { productId, size, quantity } = action.payload;
      const idx = findIndex(state.items, { productId, size });
      if (idx > -1) {
        if (quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = quantity;
      }
      persistCart(state.items);
    },
    removeItem(state, action) {
      const { productId, size } = action.payload;
      state.items = state.items.filter((i) => !(i.productId === productId && (i.size || null) === (size || null)));
      persistCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.promo = null;
      persistCart([]);
    },
    setPromo(state, action) {
      state.promo = action.payload;
    },
    clearPromo(state) {
      state.promo = null;
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, setPromo, clearPromo } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectPromo = (state) => state.cart.promo;

export default cartSlice.reducer;
