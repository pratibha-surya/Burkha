import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HomeCollection } from './homecollectionService';
import apiClient from '../../api/apiClient';


// Fetch home collections action
export const fetchHomeCollection = createAsyncThunk(
    'homeCollection/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/v1/home-collection'); // Replace with your API endpoint
            return response.data; // Assuming response contains "homeCollections"
        } catch (error) {
            console.error("Fetch failed:", error.response?.data || error.message);
            return rejectWithValue(error.message || 'Something went wrong');
        }
    }
);

const homeCollectionSlice = createSlice({
    name: 'homeCollection',
    initialState: {
        isLoading: false,
        success: false,
        error: null,
        homeCollections: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(HomeCollection.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(HomeCollection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(HomeCollection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.success = false;
            })
            // FETCH HomeCollection cases
            .addCase(fetchHomeCollection.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHomeCollection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.homeCollections = action.payload; // Assuming response contains "homeCollections"
            })
            .addCase(fetchHomeCollection.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default homeCollectionSlice.reducer;
