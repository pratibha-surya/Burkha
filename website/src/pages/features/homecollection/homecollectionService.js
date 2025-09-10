import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

export const HomeCollection = createAsyncThunk(
    'homeCollection/create',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/v1/home-collection/create', data);
            return response.data; // Automatically available as action.payload
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
            return rejectWithValue(error.message || 'Something went wrong');
        }
    }
);
