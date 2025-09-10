// src/redux/slices/cartBookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  bookCartAPI,
  fetchUserBookingsAPI,
  updateBookingStatusAPI,
  cancelBookingAPI,
  fetchallUserBookingsAPI
} from "./cartBookingAPI";

const initialState = {
  bookings: [],
  status: "idle",
  error: null,
};

// ✅ Book Cart Items
export const bookCart = createAsyncThunk("cartBooking/bookCart", async (_, thunkAPI) => {
  try {
    return await bookCartAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ✅ Fetch User Bookings
export const fetchUserBookings = createAsyncThunk("cartBooking/fetchUserBookings", async (_, thunkAPI) => {
  try {
    return await fetchUserBookingsAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
export const fetchallUserBookings = createAsyncThunk("cartBooking/fetchallUserBookings", async (_, thunkAPI) => {
  try {
    return await fetchallUserBookingsAPI();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ✅ Update Booking Status
export const updateBookingStatus = createAsyncThunk("cartBooking/updateBookingStatus", async ({ bookingId, status }, thunkAPI) => {
  try {
    return await updateBookingStatusAPI(bookingId, status);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ✅ Cancel Booking
export const cancelBooking = createAsyncThunk("cartBooking/cancelBooking", async ({bookingId,status}, thunkAPI) => {
  try {
    return await cancelBookingAPI(bookingId,status);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const cartBookingSlice = createSlice({
  name: "cartBooking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bookCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings.push(action.payload.booking);
      })
      .addCase(bookCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchallUserBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookings = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.booking._id ? action.payload.booking : booking
        );
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((booking) =>
          booking._id === action.payload.booking._id ? action.payload.booking : booking
        );
      });
  },
});

export default cartBookingSlice.reducer;
