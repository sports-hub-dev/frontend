import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_REGION, getRegion } from "../constants/regions";

const STORAGE_KEY = "sportshub_region";

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (raw && getRegion(raw.country).code === raw.country) return raw;
  } catch {
    // storage unavailable or corrupted: fall back to the default region
  }
  return { country: DEFAULT_REGION, chosen: false };
};

const save = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ country: state.country, chosen: state.chosen }));
  } catch {
    // region just won't persist across reloads
  }
};

const regionSlice = createSlice({
  name: "region",
  initialState: load(),
  reducers: {
    /** `chosen: true` = the visitor picked it in the header, so we stop auto-setting it. */
    setRegion(state, action) {
      const { country, chosen = true } = typeof action.payload === "string" ? { country: action.payload } : action.payload;
      state.country = getRegion(country).code;
      state.chosen = state.chosen || chosen;
      save(state);
    },
  },
});

export const { setRegion } = regionSlice.actions;
export const selectRegion = (state) => getRegion(state.region.country);
export const selectCurrency = (state) => getRegion(state.region.country).currency;
export default regionSlice.reducer;
