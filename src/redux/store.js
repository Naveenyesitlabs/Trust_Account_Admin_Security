"use client"
import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./slices/adminSlice.js";
import clientTrustSlice from "./slices/clientTrustSlice.js";
import notificationSlice from "./slices/notificationSlice.js";
import userSlice from "./slices/userSlice.js";
import RolePermissionSlice from "./slices/RolePermissionSlice.js";

const store = configureStore({
    reducer: {
        admin: adminSlice,
        user: userSlice,
        trustAccount: clientTrustSlice,
        notification: notificationSlice,
        adminRoles: RolePermissionSlice
    },
    devTools: true
})

export default store; 