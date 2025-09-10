import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient.js';
// import apiClient from '../../api/apiClient.js'; 

// Create a new address
export const addAddress = createAsyncThunk(
    'address/add',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.post(`/api/v1/address/create/${data.userId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error adding address:', error);
            return rejectWithValue(error.message || 'Failed to add address');
        }
    }
);

// Get all addresses for a user
export const fetchAddresses = createAsyncThunk(
    'address/fetch',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/v1/address/addresses/${userId}`);
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch addresses');
        }
    }
);

// Update an address
export const updateAddress = createAsyncThunk(
    'address/update',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/v1/address/update/${data.id}`, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update address');
        }
    }
);

// Delete an address
export const deleteAddress = createAsyncThunk(
    'address/delete',
    async (addressId, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/api/v1/address/delete/${addressId}`);
            return addressId;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to delete address');
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        addresses: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses.push(action.payload);
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Address
            .addCase(updateAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.addresses.findIndex(
                    (address) => address._id === action.payload._id
                );
                if (index !== -1) state.addresses[index] = action.payload;
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Address
            .addCase(deleteAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = state.addresses.filter(
                    (address) => address._id !== action.payload
                );
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default addressSlice.reducer;
