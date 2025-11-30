import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [] as any[],
  },
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const item = state.items.find((x) => x.id === product.id);
      if (item) {
        item.quantity++;
      } else {
        state.items.push({ ...product, quantity: 1, selected: true });
      }
    },
    incItem(state, action) {
      const id = action.payload;
      const item = state.items.find((x) => x.id === id);
      if (item) item.quantity++;
    },
    decItem(state, action) {
      const id = action.payload;
      const item = state.items.find((x) => x.id === id);
      if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
          state.items = state.items.filter((x) => x.id !== id);
        }
      }
    },
    toggleSelect(state, action) {
      const id = action.payload;
      const item = state.items.find((x) => x.id === id);
      if (item) item.selected = !item.selected;
    },
    selectAll(state, action) {
      const selected = !!action.payload;
      state.items.forEach((x) => (x.selected = selected));
    },
    removeSelected(state) {
      state.items = state.items.filter((x) => !x.selected);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((x) => x.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, incItem, decItem, toggleSelect, selectAll, removeSelected, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
