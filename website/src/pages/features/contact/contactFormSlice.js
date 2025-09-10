import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/apiClient';

// Async action to submit the contact form
export const submitContactForm = createAsyncThunk(
  'contactForm/submit',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/v1/contact/create', formData); 
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to fetch all contacts
export const fetchContacts = createAsyncThunk(
  'contactForm/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/v1/contact/all'); 
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const contactFormSlice = createSlice({
  name: 'contactForm',
  initialState: {
    loading: false,
    error: null,
    successMessage: null,
    contacts: [], // Add contacts to the state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Submit contact form cases
      .addCase(submitContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch contacts cases
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload; // Assuming response has a "contacts" key
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactFormSlice.reducer;
