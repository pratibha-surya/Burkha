import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Fetch all reports
export const fetchReports = createAsyncThunk('reports/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get('/api/v1/prescription-reports');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
});

// Fetch reports for a specific prescription
export const fetchReportsByPrescription = createAsyncThunk(
    'reports/fetchByPrescription',
    async (mobileNumber, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/v1/prescription-reports/${mobileNumber}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports for the prescription');
        }
    }
);

// Create a new report
export const createReport = createAsyncThunk('reports/create', async (data, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/v1/prescription-reports/upload', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create report');
    }
});

// Delete a report
export const deleteReport = createAsyncThunk('reports/delete', async (id, { rejectWithValue }) => {
    try {
        await apiClient.delete(`/api/v1/prescription-reports/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete report');
    }
});

// Download a report
export const downloadReport = createAsyncThunk('reports/download', async (fileName, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(`/api/v1/prescription-reports/download/${fileName}`, {
            responseType: 'blob', // Important for downloading files
        });
        return { fileName, fileBlob: response.data };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to download report');
    }
});

// Update a report
export const updateReport = createAsyncThunk('reports/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/api/v1/prescription-reports/${id}`, data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update report');
    }
});

export const updateReportStatus = createAsyncThunk(
    'reports/updateStatus',
    async (data, { rejectWithValue }) => {
        console.log(data); // Ensure data is { id: reportId, status: newStatus }

        try {
            const response = await apiClient.put(
                `/api/v1/prescription-reports/status/${data.id}`,
                { status: data.status } // Send status inside an object
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to update report status'
            );
        }
    }
);


const prescriptionReportSlice = createSlice({
    name: 'prescriptionReports',
    initialState: {
        reports: [],
        loading: false,
        error: null,
        downloadFile: null, // For holding the downloaded file
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch reports
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch reports for a specific prescription
            .addCase(fetchReportsByPrescription.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReportsByPrescription.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchReportsByPrescription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create report
            .addCase(createReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(createReport.fulfilled, (state, action) => {
                state.loading = false;
                state.reports.push(action.payload);
            })
            .addCase(createReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete report
            .addCase(deleteReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = state.reports.filter((report) => report._id !== action.payload);
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Download report
            .addCase(downloadReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(downloadReport.fulfilled, (state, action) => {
                state.loading = false;
                state.downloadFile = action.payload;
            })
            .addCase(downloadReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update report
            .addCase(updateReport.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateReport.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reports.findIndex((report) => report._id === action.payload._id);
                if (index !== -1) state.reports[index] = action.payload;
            })
            .addCase(updateReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update report status
            .addCase(updateReportStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.reports.findIndex((report) => report._id === action.payload._id);
                if (index !== -1) state.reports[index] = action.payload;
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default prescriptionReportSlice.reducer;
