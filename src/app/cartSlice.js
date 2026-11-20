import { createSlice } from "@reduxjs/toolkit";
import { setRegion } from "./regionSlice";
import { getRegion } from "../constants/regions";

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

const findIndex = (items, { type, productId, bundleId, size }) =>
  items.findIndex((i) => {
    if (i.type !== type) return false;
    if (type === "bundle") return i.bundleId === bundleId;
    return i.productId === productId && (i.size || null) === (size || null);
  });

const initialState = {
  // Each line keeps `prices` ({EGP, SAR, AED}) so switching region re-prices it.
  items: loadCart(),
  removedOnRegionChange: [],
  promo: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action) {
      const { productId, bundleId, name, mainImage, size, price, prices, quantity, selections } = action.payload;
      const type = bundleId ? "bundle" : "product";
      const idx = findIndex(state.items, { type, productId, bundleId, size });
      if (idx > -1) {
        state.items[idx].quantity += quantity;
      } else {
        state.items.push({
          type,
          productId: type === "product" ? productId : null,
          bundleId: type === "bundle" ? bundleId : null,
          name,
          mainImage,
          size: type === "product" ? size || null : null,
          selections: type === "bundle" ? selections || [] : undefined,
          price,
          prices: prices || null,
          quantity,
        });
      }
      persistCart(state.items);
    },
    updateQuantity(state, action) {
      const { productId, bundleId, size, quantity } = action.payload;
      const type = bundleId ? "bundle" : "product";
      const idx = findIndex(state.items, { type, productId, bundleId, size });
      if (idx > -1) {
        if (quantity <= 0) state.items.splice(idx, 1);
        else state.items[idx].quantity = quantity;
      }
      persistCart(state.items);
    },
    removeItem(state, action) {
      const { productId, bundleId, size } = action.payload;
      const type = bundleId ? "bundle" : "product";
      state.items = state.items.filter((i) => {
        if (i.type !== type) return true;
        if (type === "bundle") return i.bundleId !== bundleId;
        return !(i.productId === productId && (i.size || null) === (size || null));
      });
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
    dismissRemovedNotice(state) {
      state.removedOnRegionChange = [];
    },
  },
  extraReducers: (builder) => {
    // New region = new currency: re-price every line, and drop the ones that
    // aren't sold in that region (or old lines saved before prices were stored).
    builder.addCase(setRegion, (state, action) => {
      const country = typeof action.payload === "string" ? action.payload : action.payload.country;
      const currency = getRegion(country).currency;
      const kept = [];
      const removed = [];
      state.items.forEach((item) => {
        const price = item.prices ? item.prices[currency] : currency === "EGP" ? item.price : null;
        if (typeof price === "number" && price > 0) kept.push({ ...item, price });
        else removed.push(item.name);
      });
      state.items = kept;
      state.removedOnRegionChange = removed;
      if (removed.length || kept.length === 0) state.promo = null;
      persistCart(kept);
    });
  },
});

export const { addItem, updateQuantity, removeItem, clearCart, setPromo, clearPromo, dismissRemovedNotice } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectPromo = (state) => state.cart.promo;

export default cartSlice.reducer;