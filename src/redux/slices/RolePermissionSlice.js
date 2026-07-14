import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";

/**
 * Get all AdminRoles
 */
export const getAllAdminRoles = createAsyncThunk(
    "roles/getAllAdminRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getAllAdminRoles();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


/**
 * Create AdminRoles
 */
export const createAdminRoles = createAsyncThunk(
    "roles/createAdminRoles",
    async (newRole, { rejectWithValue }) => {
        try {
            const response = await api.createAdminRoles(newRole);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Update AdminRoles
 */
export const updateAdminRoles = createAsyncThunk(
    "roles/updateAdminRoles",
    async ({ roleId, data }, { rejectWithValue }) => {
        try {
            const response = await api.updateRole(roleId, data);
            return response.data; // ✅ now response is defined
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);






/**
 * Delete AdminRoles
 */
export const deleteAdminRoles = createAsyncThunk(
    "roles/deleteAdminRoles",
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await api.deleteAdminRoles(roleId);
            return { id: roleId };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


/**
 * Admin GetModules
 */
export const getModules = createAsyncThunk(
    "roles/getModules",
    async (roleId, { rejectWithValue }) => {
        try {
            const response = await api.getModules();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


/**
 * Admin getMenuByModule
 */
export const getMenuByModule = createAsyncThunk(
    "roles/getMenuByModule",
    async (selectedMenu, { rejectWithValue }) => {
        try {
            const response = await api.getMenuByModule(selectedMenu);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const asignMenuPermission = createAsyncThunk(
    "roles/asignMenuPermission",
    async (newRole, { rejectWithValue }) => {
        try {
            const response = await api.asignMenuPermission(newRole);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Create NewUser
 */
export const createNewUser = createAsyncThunk(
    "roles/createNewUser",
    async (newRole, { rejectWithValue }) => {
        try {
            const response = await api.createNewUser(newRole);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


/**
 * View permission
 */
export const viewPermission = createAsyncThunk(
    "roles/viewPermission",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.viewPermission();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Fetch roles
 */
export const fetchRoles = createAsyncThunk(
    "roles/fetchRoles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.getAllRoles();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

/**
 * Fetch selected modules by role
 */
export const getSelectedModuleByRoleId = createAsyncThunk(
    "roles/getSelectedModuleByRoleId",
    async (role_id, { rejectWithValue }) => {
        try {
            const response = await api.getSelectedModuleByRoleId(role_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)


const rolePermissionSlice = createSlice({
    name: "adminRoles",
    initialState: {
        adminRoles: [],
        modules: [],
        menuModule: [],
        permission: [],
        allRoles: [],
        roleModules: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        resetMenuModule: (state) => {
            state.menuModule = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAdminRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getAllAdminRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.adminRoles = action?.payload?.data || [];
            })
            .addCase(getAllAdminRoles.rejected, (state, action) => {
                state.loading = false;
                state.adminRoles = [];
                state.error = action.payload || "Failed to fetch admin roles";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error fetching roles");
            })

            // Create AdminRoles___

            .addCase(createAdminRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createAdminRoles.fulfilled, (state, action) => {
                state.loading = false;
                // state.adminRoles = action?.payload?.data || [];
                toast.success(action.payload.message || "Role created successfully")
            })
            .addCase(createAdminRoles.rejected, (state, action) => {
                state.loading = false;
                // state.adminRoles = [];
                // state.error = action.payload || "Failed to create admin roles";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error create roles");
            })

            // update AdminRoles___
            .addCase(updateAdminRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(updateAdminRoles.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.success) {
                    toast.success(action.payload.message || "Role updated successfully");
                } else {
                    toast.error("Failed to update admin roles");
                }
            })
            .addCase(updateAdminRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = "Failed to update admin roles";
                toast.error("Failed to update admin roles");
            })


            // delete AdminRoles___

            .addCase(deleteAdminRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(deleteAdminRoles.fulfilled, (state, action) => {
                state.loading = false;
                // state.adminRoles = action?.payload?.data || [];
                toast.success(action.payload.message || "Role delete successfully")
            })
            .addCase(deleteAdminRoles.rejected, (state, action) => {
                state.loading = false;
                // state.adminRoles = [];
                state.error = action.payload || "Failed to delete admin roles";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error delete roles");
            })

            // getModules_________

            .addCase(getModules.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getModules.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action?.payload?.data || [];
                // toast.success(action.payload.message || "Menu featch successfully")
            })
            .addCase(getModules.rejected, (state, action) => {
                state.loading = false;
                state.modules = [];
                state.error = action.payload || "Failed to featch menu";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error featch menu");
            })

            // Admin getMenuByModule_________

            .addCase(getMenuByModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(getMenuByModule.fulfilled, (state, action) => {
                state.loading = false;
                state.menuModule = action?.payload?.data || [];
                // toast.success(action.payload.message || "Menu featch successfully")
            })
            .addCase(getMenuByModule.rejected, (state, action) => {
                state.loading = false;
                state.menuModule = [];
                state.error = action.payload || "Failed to featch menu";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error featch menu");
            })

            // asignMenuPermission___

            .addCase(asignMenuPermission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(asignMenuPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.adminRoles = action?.payload?.data || [];
                // toast.success(action.payload.message || "Role asign successfully")
            })
            .addCase(asignMenuPermission.rejected, (state, action) => {
                state.loading = false;
                state.adminRoles = [];
                state.error = action.payload || "Failed to role asign";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error role asign");
            })


            // Create NewUser
            .addCase(createNewUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(createNewUser.fulfilled, (state, action) => {
                state.loading = false;
                // state.permission = action?.payload?.data || [];
                toast.success(action.payload.message || "Usre created successfully")
            })
            .addCase(createNewUser.rejected, (state, action) => {
                state.loading = false;
                // state.permission = [];
                state.error = action.payload || "Failed to create user";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error create user");
            })


            // getModules_________

            .addCase(viewPermission.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(viewPermission.fulfilled, (state, action) => {
                state.loading = false;
                state.permission = action?.payload?.data || [];
                // toast.success(action.payload.message || "Menu featch successfully")
            })
            .addCase(viewPermission.rejected, (state, action) => {
                state.loading = false;
                state.permission = [];
                state.error = action.payload || "Failed to featch menu";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error featch menu");
            })

            // get all roles
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.allRoles = action?.payload?.data || [];
                // toast.success(action.payload.message || "Menu featch successfully")
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.allRoles = [];
                state.error = true;
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message);
            })

            // fetch selected module by role
            .addCase(getSelectedModuleByRoleId.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.message = null;
                state.roleModules = [];
            })
            .addCase(getSelectedModuleByRoleId.fulfilled, (state, action) => {
                state.loading = false;
                state.roleModules = action?.payload?.data || [];
                // toast.success(action.payload.message || "Menu featch successfully")
            })
            .addCase(getSelectedModuleByRoleId.rejected, (state, action) => {
                state.loading = false;
                state.roleModules = [];
                state.error = action.payload || "Failed to featch menu";
                state.message = action?.payload?.message || null;
                toast.error(action?.payload?.message || "Error featch menu");
            })

    }
})
export const { resetMenuModule } = rolePermissionSlice.actions;
export default rolePermissionSlice.reducer;
