import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UploadPrescription } from "../prescription/prescriptionService"
import apiClient from '../../api/apiClient';


export const prescription = createAsyncThunk(
    'api/v1/prescription/upload',
    async (data, { rejectWithValue }) => {
        try {
            return await UploadPrescription(data);
        } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const fetchPrescriptions = createAsyncThunk(
    'prescription/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/v1/prescription');
            return response.data;
        } catch (error) {
            console.error('Fetch failed:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const prescriptionSlice = createSlice({
    name: 'prescription',
    initialState: {
        prescriptions: [],
        loading: false,
        error: null,
    },
    reducers: {
        // setPrescription(state, action) {
        //     state.prescription = action.payload;
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(prescription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(prescription.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions.push(action.payload);
            })
            .addCase(prescription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPrescriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPrescriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions = action.payload.data;
            })
            .addCase(fetchPrescriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});



export default prescriptionSlice.reducer;




