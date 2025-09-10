import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../api/apiClient';


// ✅ Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`/api/v1/cart/get-cart`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ✅ Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async ({  itemId, quantity }, { rejectWithValue }) => {
  console.log(itemId, quantity);
  
  try {
    const response = await apiClient.post(`/api/v1/cart/add-to-cart`, { itemId, quantity });
    console.log(response.data);
    
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ✅ Update Quantity
export const updateCart = createAsyncThunk("cart/updateCart", async ({  itemId, action }, { rejectWithValue }) => {
  try {
    const response = await apiClient.put(`/api/v1/cart/update-quantity`, {  itemId, action });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ✅ Remove from Cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({  itemId }, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`/api/v1/cart/remove-from-cart`, { data: { itemId } });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
