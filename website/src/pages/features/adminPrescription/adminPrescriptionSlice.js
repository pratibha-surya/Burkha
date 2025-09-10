// adminPrescriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const fetchPrescriptions = createAsyncThunk(
    'adminPrescriptions/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/v1/prescription');
            return response.data.data;
        } catch (error) {
            console.error("Fetch failed:", error.response?.data || error.message);
            return rejectWithValue(error.message || 'Failed to fetch prescriptions');
        }
    }
);

const adminPrescriptionSlice = createSlice({
    name: 'adminPrescriptions',
    initialState: {
        prescriptions: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPrescriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions = action.payload;
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default adminPrescriptionSlice.reducer;
