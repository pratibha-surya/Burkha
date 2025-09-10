import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Login } from '../auth/AuthService';
import { Register } from '../auth/AuthService';
import { Logout } from '../auth/AuthService';
import { update } from '../auth/AuthService';
import { password } from '../auth/AuthService';
// import { deleteUser } from '../auth/AuthService';
import { toast } from 'react-toastify';
import apiClient from '../api/apiClient';


export const register = createAsyncThunk(
    'api/v1/admin/register',
    async (credentials, { rejectWithValue }) => {
        try {
            return await Register(credentials);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);
export const updateUser = createAsyncThunk(
    'api/v1/admin/updateUser',
    async (credentials, { rejectWithValue }) => {
        try {
            return await update(credentials);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'user update failed');
        }
    }
);
export const changePassword = createAsyncThunk(
    'api/v1/admin/changePassword',
    async (credentials, { rejectWithValue }) => {
        try {
            return await password(credentials);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'change password failed');
        }
    }
);

export const login = createAsyncThunk(
    'api/v1/admin/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await Login(credentials);
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'api/v1/admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await Logout();
        } catch (error) {
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);

// Fetch users action
export const fetchUsers = createAsyncThunk(
    'auth/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/v1/admin/all'); // Replace with your endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const todayLoginUser = createAsyncThunk(
    'auth/todayLoginUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/v1/admin/logins/today'); // Replace with your endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch today login users');
        }
    }
);

export const deleteUserAction = createAsyncThunk(
    'auth/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/api/v1/admin/delete/${id}`); // Replace with your endpoint
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        console.log(email);
        
        try {
            const response = await apiClient.post( '/api/v1/admin/forgot-password', { email });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, newPassword }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/v1/admin/reset-password`, { token, newPassword });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Something went wrong');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        users: [],
        todayLoginUsers: [], // Initialize users state for all users
    },
    reducers: {
        logingout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token'); // Clear token from localStorage
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
                const timestamp = new Date().getTime(); // Current timestamp
                localStorage.setItem('token', action.payload.token); // Store token in localStorage
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('timestamp', timestamp); // Save timestamp
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('timestamp');
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch users cases
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload; // Assuming response contains "users"
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(todayLoginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(todayLoginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.todayLoginUsers = action.payload; // Assuming response contains "users"
            })
            .addCase(todayLoginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase (deleteUserAction.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.id !== action.payload.id);
            })
            .addCase(deleteUserAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload);
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
            
    },
});


export const { logingout } = authSlice.actions;

export default authSlice.reducer;
