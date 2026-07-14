import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js"; // Assuming the API function is inside Api.js
import { clearAuthSession } from "../../utils/authStorage.js";

// For Unauthenticated User
function logouterror() {
    toast.error("Token Expired");
    clearAuthSession();
    setTimeout(() => {
        window.location.href = "/";  // Redirect to login page
    }, 1000);
}

// Get Trust Account action
export const getAllClientTrustAccount = createAsyncThunk(
    "/admin/getAllClientTrustAccount",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getAllClientTrustAccount();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Create Trust Account action
export const createTrustAccount = createAsyncThunk(
    "/admin/createTrustAccount",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.createTrustAccount(formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Update Trust Account action
// export const updateTrustAccount = createAsyncThunk(
//     "/admin/updateTrustAccount",
//     async (formData, { rejectWithValue }) => {
//         try {
//             const response = await api.updateTrustAccount(formData);
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

export const updateTrustAccount = createAsyncThunk(
    "/admin/updateTrustAccount",
    async ({ clientId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.updateTrustAccount(clientId, formData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// Delete Trust Account action
export const deleteTrustAccount = createAsyncThunk(
    "/admin/deleteTrustAccount",
    async (clientId, { rejectWithValue }) => {
        try {
            const response = await api.deleteTrustAccount(clientId);
            return clientId;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


// trustAccount slice
const trustAccount = createSlice({
    name: "trustAccount",
    initialState: {
        trustAccount: [],
        loading: false,
        error: null,
        message: null,
        userIdAndUrl: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get all trust accounts
            .addCase(getAllClientTrustAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClientTrustAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.trustAccount = action.payload?.data || [];
            })
            .addCase(getAllClientTrustAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch trust accounts";
                if (action.payload?.message === "Invalid token.") {
                    logouterror();
                }
            })

            // Create Trust Account
            .addCase(createTrustAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTrustAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Trust account created successfully!";
                toast.success("Trust account created successfully!");
                state.trustAccount.push(action.payload);
            })
            .addCase(createTrustAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action?.payload?.message);
            })

            // Update Trust Account
            .addCase(updateTrustAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTrustAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Trust account updated successfully!";
                toast.success("Trust account updated successfully!");
                // Find the trust account to update and replace it with the updated one
                const updatedAccountIndex = state.trustAccount.findIndex(
                    (account) => account.id === action.payload.id
                );
                if (updatedAccountIndex !== -1) {
                    state.trustAccount[updatedAccountIndex] = action.payload;
                }
            })
            .addCase(updateTrustAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                toast.error(action?.payload?.message);
            })

            // Delete Trust Account
            .addCase(deleteTrustAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTrustAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Trust account deleted successfully!";
                // Remove the deleted trust account from the list
                state.trustAccount = state.trustAccount.filter(
                    (account) => account.id !== action.payload
                );
            })
            .addCase(deleteTrustAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete trust account";
            });
    },
});

export default trustAccount.reducer;
