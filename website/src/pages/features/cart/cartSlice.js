import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, addToCart, updateCart, removeFromCart } from "./cartActions";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {}, // No local reducers needed, as we handle async API calls

  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // Update Quantity
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      })

      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
      });
  },
});

export default cartSlice.reducer;
