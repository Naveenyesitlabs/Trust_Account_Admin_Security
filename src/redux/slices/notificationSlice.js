import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";

/**
 * Get all notifications
 */
export const getAllNotifications = createAsyncThunk(
  'notification/getAllNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getNotifications();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


/**
 * Mark notification as read
 */
export const notificationReadStatusUpdate = createAsyncThunk('notification/notificationReadStatusUpdate', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.markNotificationRead(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetching notifications
      .addCase(getAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action?.payload?.message;
        state.notification = action?.payload?.data || [];
      })
      .addCase(getAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
        state.message = action?.payload?.message;
        state.notification = [];
        toast.error(action?.payload?.message);
      })

      // notification mark read
      .addCase(notificationReadStatusUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(notificationReadStatusUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "Notification marked as read";
        state.message = action?.payload?.message;
        // toast.success(action?.payload?.message);
      })
      .addCase(notificationReadStatusUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark notification as read";
        state.message = action?.payload?.message;
        toast.error(action?.payload?.message);
      })
  },
});

export default notificationSlice.reducer;