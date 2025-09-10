import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from '../../api/apiClient';


export const fetchSearchResults = createAsyncThunk("search/fetchResults", async (query) => {
    const { data } = await apiClient.get(`/api/v1/search?query=${query}`);
    return data;
});

const searchSlice = createSlice({
    name: "search",
    initialState: { results: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default searchSlice.reducer;
