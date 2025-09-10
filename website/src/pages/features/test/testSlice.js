// src/features/test/testSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Async Thunks
export const fetchTests = createAsyncThunk('tests/fetchTests', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/api/v1/test');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch tests');
    }
});

export const fetchTestById = createAsyncThunk('tests/fetchTestById', async (id, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/api/v1/test/fetchTestById/${id}`);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch test by ID');
    }
});

export const createTest = createAsyncThunk('tests/createTest', async (testData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/v1/test', testData);
        log(response.data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create test');
    }
});

export const updateTest = createAsyncThunk('tests/updateTest', async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/api/v1/test/${id}`, updatedData);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update test');
    }
});

export const deleteTest = createAsyncThunk('tests/deleteTest', async (id, { rejectWithValue }) => {
    try {
        const response = await apiClient.delete(`/api/v1/test/${id}`);
        return response.data.message;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete test');
    }
});

// Test Slice
const testSlice = createSlice({
    name: 'tests',
    initialState: {
        tests: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Tests
            .addCase(fetchTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(fetchTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Test
            .addCase(createTest.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTest.fulfilled, (state, action) => {
                state.loading = false;
                state.tests.push(action.payload);
            })
            .addCase(createTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Test
            .addCase(updateTest.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTest.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tests.findIndex((test) => test._id === action.payload._id);
                if (index !== -1) {
                    state.tests[index] = action.payload;
                }
            })
            .addCase(updateTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Test
            .addCase(deleteTest.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTest.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = state.tests.filter((test) => test._id !== action.meta.arg);
            })
            .addCase(deleteTest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Test by ID
            .addCase(fetchTestById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTestById.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(fetchTestById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default testSlice.reducer;
