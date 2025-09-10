import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";



// Async Thunks for API calls

// Fetch all bookings
export const fetchBookings = createAsyncThunk(
    "booking/fetchBookings",
    async (_, thunkAPI) => {
        try {
            const response = await apiClient.get("/api/v1/booking");
            return response.data.data; // Assuming API response has a `data` field
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Fetch a single booking by ID
export const fetchBookingById = createAsyncThunk(
    "booking/fetchBookingById",
    async (bookingId, thunkAPI) => {
        try {
            const response = await apiClient.get(`/api/v1/booking/id`);
            return response.data.data; // Assuming API response has a `data` field
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Create a booking
export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (bookingData, thunkAPI) => {
        try {
            
            const response = await apiClient.post("/api/v1/booking", bookingData);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Delete a booking
export const deleteBooking = createAsyncThunk(
    "booking/deleteBooking",
    async (bookingId, thunkAPI) => {
        try {
            const response = await apiClient.delete(`/api/v1/booking/${bookingId}`);
            return { bookingId };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateBooking = createAsyncThunk(
    "booking/updateBooking",
    async ({ bookingId, updatedData }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/api/v1/booking/${bookingId}`, updatedData);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    "booking/updateBookingStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await apiClient.put(`/api/v1/booking/update-status/${id}`, { status });
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// Slice
const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookings: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch bookings
        builder.addCase(fetchBookings.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBookings.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = action.payload;
        });
        builder.addCase(fetchBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Create booking
        builder.addCase(createBooking.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings.push(action.payload);
        });
        builder.addCase(createBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete booking
        builder.addCase(deleteBooking.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deleteBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = state.bookings.filter(
                (booking) => booking._id !== action.payload.bookingId
            );
        });
        builder.addCase(deleteBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Update booking
        builder.addCase(updateBooking.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateBooking.fulfilled, (state, action) => {
            state.loading = false;
            const updatedBooking = action.payload;
            const index = state.bookings.findIndex((booking) => booking._id === updatedBooking._id);
            if (index !== -1) {
                state.bookings[index] = updatedBooking;
            }
        });
        builder.addCase(updateBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // fatch booking by id
        builder.addCase(fetchBookingById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBookingById.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = action.payload;
        });
        builder.addCase(fetchBookingById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Update booking status
        builder.addCase(updateBookingStatus.fulfilled, (state, action) => {
            const updatedBooking = action.payload;
            const index = state.bookings.findIndex((booking) => booking._id === updatedBooking._id);
            if (index !== -1) {
                state.bookings[index] = updatedBooking;
            }
        });

    },  
});

export default bookingSlice.reducer;
