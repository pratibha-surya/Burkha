// src/redux/features/packageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";



// Thunks for async operations

// Fetch all packages
export const fetchPackages = createAsyncThunk(
    "packages/fetchPackages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get("/api/v1/package");
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Fetch a single package by ID
export const fetchPackageById = createAsyncThunk(
    "packages/fetchPackageById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/v1/package/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create a new package
export const createPackage = createAsyncThunk(
    "packages/createPackage",
    async (packageData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post("/api/v1/package", packageData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update a package
export const updatePackage = createAsyncThunk(
    "packages/updatePackage",
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            console.log(updatedData, "updatedData");
            
            const response = await apiClient.put(`/api/v1/package/${id}`, updatedData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Delete a package
export const deletePackage = createAsyncThunk(
    "packages/deletePackage",
    async (id, { rejectWithValue }) => {
        try {
            await apiClient.delete(`/api/v1/package/${id}`);
            return id; // Return the deleted package ID
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Slice for package management
const packageSlice = createSlice({
    name: "packages",
    initialState: {
        packages: [],
        package: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all packages
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch a single package
            .addCase(fetchPackageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackageById.fulfilled, (state, action) => {
                state.loading = false;
                state.package = action.payload;
            })
            .addCase(fetchPackageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create a package
            .addCase(createPackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages.push(action.payload);
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update a package
            .addCase(updatePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = state.packages.map((pkg) =>
                    pkg._id === action.payload._id ? action.payload : pkg
                );
            })
            .addCase(updatePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete a package
            .addCase(deletePackage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = state.packages.filter((pkg) => pkg._id !== action.payload);
            })
            .addCase(deletePackage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default packageSlice.reducer;
