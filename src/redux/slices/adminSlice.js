import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";
import { clearAuthSession, hasAuthSession, storeAuthSession } from "../../utils/authStorage.js";

// Utility to check if we're in the browser environment
const isBrowser = typeof window != "undefined";
const normalizeRole = (role = "") => role.toString().toLowerCase().replace(/\s+/g, "");

// Login async thunk
export const login = createAsyncThunk("/superadmin/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.login(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// forgot password otp send email
export const sendOtp = createAsyncThunk("/superadmin/sendOtp", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.forgotPassword(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// verify otp
export const checkOtp = createAsyncThunk("/superadmin/checkOtp", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.verifyOtp(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


// export cont newPassword
export const newPassword = createAsyncThunk("/superadmin/newPassword", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.resetPassword(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


// checkUser action
export const checkUser = createAsyncThunk("/superadmin/checkUser", async () => {
  try {
    const response = await api.checkUser();
    return response.data;
  } catch (error) {
    throw error;
  }
});



// AddFirms action
export const addFirms = createAsyncThunk("/superadmin/addFirms", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addFirms(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update Firms Access action
export const updateFirmsAccess = createAsyncThunk("/superadmin/updateFirmsAccess", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirmsAccess(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


// Update Suspend Status action
export const updateSuspendStatus = createAsyncThunk("/superadmin/updateSuspendStatus", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateSuspendStatus(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// Update Firm action
export const updateFirm = createAsyncThunk("/superadmin/updateFirm", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirm(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete Firm action
export const deleteFirm = createAsyncThunk("/superadmin/deleteFirm", async (id, { rejectWithValue }) => {
  try {
    const response = await api.deleteFirm(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});



//--------------------- Manage Attorney -------------------

// Get Attorney action
export const getAllAttorney = createAsyncThunk('/admin/getAllAttorney', async () => {
  try {
    const response = await api.getAllAttorney();
    return response.data;
  } catch (error) {
    throw error;
  }
});

// Update Attorney action
export const updateAttorney = createAsyncThunk('/admin/updateAttorney', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateAttorney(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// Create Attorney action
export const createAttorney = createAsyncThunk('/admin/createAttorney', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createAttorney(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})
// Create Attorney action
export const deleteAttorney = createAsyncThunk('/admin/deleteAttorney', async (id) => {
  try {
    const response = await api.deleteAttorney(id);
    return response.data;
  } catch (error) {
    throw error;
  }
})

//---------------------- Manage Users -------------------
// Get All Users action
export const getAllUsers = createAsyncThunk('/admin/getAllUsers', async ({ admin_id }, { rejectWithValue }) => {
  try {
    const response = await api.getAllUsers(admin_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})
// Create Users action
export const createUsers = createAsyncThunk('/admin/createUsers', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.createUsers(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// UpdateUsers action
export const updateUsers = createAsyncThunk('/admin/updateUsers', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateUsers(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// Get All Users action
export const deleteUser = createAsyncThunk('/admin/deleteUser', async (id) => {
  try {
    const response = await api.deleteUser(id);
    return response.data;
  } catch (error) {
    throw error
  }
})


// Get All Users change access
export const changeAccess = createAsyncThunk('/admin/change/access', async (formData) => {
  try {

    const response = await api.changeAccess(formData);
    return response.data;
  } catch (error) {
    throw error
  }
})


//------------------------ Journal Entry----------------------------


// Get All Users action
export const getAllJournalEntry = createAsyncThunk('/admin/getAllJournalEntry', async () => {
  try {
    const response = await api.getAllJournalEntry();
    return response.data;
  } catch (error) {
    throw error
  }
})


// Get All Users action
export const getJournalEntry = createAsyncThunk('/admin/getJournalEntry', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getJournalEntry(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


// Add Journal Entry action
export const addJournalEntry = createAsyncThunk('/admin/addJournalEntry', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addJournalEntry(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// Add Journal Entry action
export const addLedgerEntry = createAsyncThunk('/admin/addLedgerEntry', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addJournalEntry(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})

// Update Journal Entry action
export const updateJournalEntry = createAsyncThunk('/admin/updateJournalEntry', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateJournalEntry(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


// Delete Journal Entry action
export const deleteJournalEntry = createAsyncThunk('/admin/deleteJournalEntry', async (id) => {
  try {
    const response = await api.deleteJournalEntry(id);
    return response.data;
  } catch (error) {
    throw error
  }
})

export const deleteLedgerEntry = createAsyncThunk('/admin/deleteLedgerEntry', async (id) => {
  try {
    const response = await api.deleteJournalEntry(id);
    return response.data;
  } catch (error) {
    throw error
  }
})


//--------------------- Client Ledger ----------------------
export const getAllClientLedger = createAsyncThunk('/admin/getAllClientLedger', async () => {
  try {
    const response = await api.getAllClientLedger();
    return response.data;
  } catch (error) {
    throw error
  }
})



export const getClientLedger = createAsyncThunk('/admin/getClientLedger', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getClientLedger(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


export const updateLedgerData = createAsyncThunk('/admin/updateLedgerData', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateClientLedger(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})


export const getAllFirmList = createAsyncThunk('/admin/getAllFirmList', async () => {
  try {
    const response = await api.getFirms();
    return response.data;
  } catch (error) {
    throw error
  }
})

export const getClientListByFirm = createAsyncThunk('/admin/getClientListByFirm', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.getClientsByFirm(formData);
    return response.data;
  } catch (error) {
    throw error
  }
})

export const getClientInfoById = createAsyncThunk('/admin/getClientInfoById', async ({ client_id }, { rejectWithValue }) => {
  try {
    const response = await api.getClientInfo(client_id);
    return response.data;
  } catch (error) {
    throw error
  }
})

//--------------------- getAllClient ----------------------

export const getAllClient = createAsyncThunk('/admin/getAllClient', async ({ rejectWithValue }) => {
  try {
    const response = await api.getAllClient();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})



// --------------------- getAllClientAccounts ----------------------

export const getAllClientAccounts = createAsyncThunk(
  '/admin/getAllClientAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllClientTrustAccount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ---------------------- Case API ----------------------
export const getAllCases = createAsyncThunk('/admin/getAllCases', async (_, { rejectWithValue }) => {
  try {
    const response = await api.getAllCases();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


export const getCaseInfoById = createAsyncThunk('/admin/getCaseInfoById', async ({ case_id }, { rejectWithValue }) => {
  try {
    const response = await api.getCaseInfo(case_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const addNewCase = createAsyncThunk("journal/addNewCase", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addNewCase(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
})



const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    allFirmsUsers: [],
    notification: [],
    allAttorney: [],
    allUsers: [],
    allJournalEntryBank: [],
    journalEntry: [],
    clients: [],
    firms: [],
    getAllClient: [],
    allClientLedger: [],
    ledgerClientInfo: [],
    clientsByFirm: [],
    clientsForLedgers: [],
    cases: [],
    caseInfo: {},
    userLogedOut: isBrowser ? !hasAuthSession() : true,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login slice
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = false;
        state.admin = action.payload;
        if (typeof window != "undefined") {
          if (normalizeRole(action?.payload?.role) == "admin") {
            storeAuthSession(action.payload);
          } else {
            toast.error("Invalid Credential")
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message)
      })

      // forgot password
      .addCase(sendOtp.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = true;
        toast.success(action.payload?.message)
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message)
      })

      // verify otp
      .addCase(checkOtp.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(checkOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = true;
        toast.success(action.payload?.message)
      })
      .addCase(checkOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message)
      })

      // reset password
      .addCase(newPassword.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(newPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = true;
        toast.success(action.payload?.message)
      })
      .addCase(newPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message)
      })

      // checkUser slice
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        if (normalizeRole(action?.payload?.user?.role) != "admin") {
          clearAuthSession();
          toast.error("session expired")

          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      })

      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        clearAuthSession();
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })




      // AddFirms slice
      .addCase(addFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFirms.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.data?.message)
      })
      .addCase(addFirms.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })

      // Update Firms Access slice
      .addCase(updateFirmsAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirmsAccess.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.data?.message)
      })
      .addCase(updateFirmsAccess.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // Update-Suspend-Status slice
      .addCase(updateSuspendStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSuspendStatus.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
      })
      .addCase(updateSuspendStatus.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })

      // Update Firm slice
      .addCase(updateFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirm.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
      })
      .addCase(updateFirm.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // Update Firm slice
      .addCase(deleteFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFirm.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.data?.message)
      })
      .addCase(deleteFirm.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // change_access  Firm slice
      .addCase(changeAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeAccess.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(changeAccess.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      //---------------------------- Manage Attorney ------------------------------

      // getAllAttorney slice
      .addCase(getAllAttorney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAttorney.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.attorney = action?.payload?.data

      })
      .addCase(getAllAttorney.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })



      // update Attorney slice
      .addCase(updateAttorney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttorney.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(updateAttorney.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // Create Attorney slice
      .addCase(createAttorney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAttorney.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(createAttorney.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // Delete Attorney slice
      .addCase(deleteAttorney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAttorney.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(deleteAttorney.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }

      })


      // Get All Users slice
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allUsers = action?.payload?.data;
        // toast.success(action?.payload?.message)
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;

        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Create Users slice
      .addCase(createUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUsers.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(createUsers.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Update Users slice
      .addCase(updateUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        // state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(updateUsers.rejected, (state, action) => {
        state.loading = false;
        // state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      // Delete Users slice
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message)
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      //---------------------Journal Entry----------------------


      // Journal Entry slice
      .addCase(getAllJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllJournalEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allJournalEntryBank = action?.payload?.data

      })
      .addCase(getAllJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Journal Entry slice
      .addCase(getJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJournalEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.journalEntry = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;

        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Add Journal Entry slice
      .addCase(addJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addJournalEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.journalEntry = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(addJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Update Journal Entry slice
      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.journalEntry = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      .addCase(deleteJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        // state.journalEntry = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })






      // ---------- Client Ledger------------------

      // Get All Client Ledger
      .addCase(getAllClientLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClientLedger.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.getAllClient = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getAllClientLedger.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Get Client Ledger
      .addCase(getClientLedger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientLedger.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allClientLedger = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getClientLedger.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;

        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })
      .addCase(getAllFirmList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFirmList.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.firms = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getAllFirmList.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.firms = [];
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      .addCase(getClientListByFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientListByFirm.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.clientsByFirm = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getClientListByFirm.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.clientsByFirm = [];
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      .addCase(getClientInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClientInfoById.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.clientsForLedgers = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getClientInfoById.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.clientsForLedgers = [];
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      // Add Journal Entry slice
      .addCase(addLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLedgerEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allClientLedger = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(addLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action.payload.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })


      .addCase(updateLedgerData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLedgerData.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        // state.allClientLedger = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(updateLedgerData.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })
      .addCase(deleteLedgerEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLedgerEntry.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        // state.allClientLedger = action?.payload?.data
        toast.success(action.payload.message)
      })
      .addCase(deleteLedgerEntry.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })



      // ___________________________________

      // Get All Client
      .addCase(getAllClientAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClientAccounts.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.clients = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getAllClientAccounts.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        state.clients = null
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      // fetching cases
      .addCase(getAllCases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCases.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.cases = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getAllCases.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        state.cases = null
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      // fetching case info by id
      .addCase(getCaseInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCaseInfoById.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.caseInfo = action?.payload?.data
        // toast.success(action.payload.message)
      })
      .addCase(getCaseInfoById.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        state.caseInfo = null
        toast.error(action?.payload?.message)
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })

      // adding new case
      .addCase(addNewCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewCase.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action?.payload?.message || "Case added successfully";
        state.error = false;
        toast.success(action?.payload?.message || "Case added successfully");
      })
      .addCase(addNewCase.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action?.payload?.message || "Something went wrong";
        if (typeof window !== "undefined") {
          const hasAccess = action?.payload?.data?.hasAccess === false;
          if (hasAccess) {
            setTimeout(() => {
              // Clear any stored tokens or local storage if needed
              localStorage.clear(); // or remove specific token
              window.location.href = '/login'; // redirect to login page
            }, 1000);
          }
        }
      })
  },
});

export default authSlice.reducer;
