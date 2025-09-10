import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from "../../api/apiClient";

const API_URL = "/api/v1/city/cities";



// Fetch all cities
export const fetchCities = createAsyncThunk("cities/fetchCities", async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch cities");
    }
});

// Add new city
export const addCity = createAsyncThunk("cities/addCity", async (cityData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(API_URL, cityData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add city");
    }
});

// Update city
export const updateCity = createAsyncThunk("cities/updateCity", async ({ id, name }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`${API_URL}/${id}`, { name });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update city");
    }
});

// Delete city
export const deleteCity = createAsyncThunk("cities/deleteCity", async (id, { rejectWithValue }) => {
    try {
        await apiClient.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete city");
    }
});

const citiesSlice = createSlice({
    name: "cities",
    initialState: {
        cities: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCities.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCities.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.cities = action.payload;
            })
            .addCase(fetchCities.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addCity.fulfilled, (state, action) => {
                state.cities.push(action.payload);
            })
            .addCase(updateCity.fulfilled, (state, action) => {
                const index = state.cities.findIndex((city) => city._id === action.payload._id);
                if (index !== -1) {
                    state.cities[index] = action.payload;
                }
            })
            .addCase(deleteCity.fulfilled, (state, action) => {
                state.cities = state.cities.filter((city) => city._id !== action.payload);
            });
    },
});

export default citiesSlice.reducer;