// import axios from 'axios';
import API from "../utils/axiosInstance";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_BACKEND_URL,
//   headers: {
//     'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-admin"))?.token}`,
//   }
// });


export const login = (formData) => API.post("/api/login", formData);

export const forgotPassword = (formData) => API.post("/api/forgot-password", formData);

export const verifyOtp = (formData) => API.post("/api/verify-otp", formData);

export const resetPassword = (formData) => API.post("/api/reset-password", formData);

export const checkUser = () => API.get("/api/protected");

export const logout = (id) => API.post('/api/logout', id, {

});


// ------------------------------ Manage Attorney -----------------------------------------------

export const getAllAttorney = () => API.get(`/api/admin/get-all-attorneys`);

export const updateAttorney = (formData) => API.patch(`/api/admin/update-attorney/${formData.id}`, formData.formData);

export const createAttorney = (formData) => API.post(`/api/admin/add-attorney`, formData);

export const deleteAttorney = (id) => API.delete(`/api/admin/delete-attorney/${id}`);


//---------------------------- Manage Users -------------------------------------------------------

export const getAllUsers = (admin_id) => API.get(`/api/admin/get-usermanagement?admin_id=${admin_id}`);

export const createUsers = (formData) => API.post(`/api/admin/add-usermanagement`, formData)

export const updateUsers = (formData) => API.put(`/api/admin/update-usermanagement/${formData.id}`, formData.values);

export const deleteUser = (id) => API.delete(`/api/admin/delete-usermanagement/${id}`);

export const changeAccess = (formData) => API.patch(`/api/admin/change/access`, formData);




//------------------------- Journal Entry Manager ---------------------------------------------------

export const getAllJournalEntry = () => API.get(`/api/admin/get-all-journal-entries`);

export const getJournalEntry = (formData) => API.post(`/api/admin/get-journal-entries`, formData);

export const addJournalEntry = (formData) => API.post(`/api/admin/add-journal-entry`, formData);

export const updateJournalEntry = (formData) => API.put(`/api/admin/update-journal-entry/${formData.id}`, formData.formData);

export const deleteJournalEntry = (id) => API.delete(`/api/admin/delete-journal-entry/${id}`);


//--------------------------- Client Ledger Manager --------------------------------------------------

export const getAllClientLedger = () => API.get(`/api/admin/get-all-client-ledgers`);

export const getClientLedger = (formData) => API.post(`/api/admin/get-client-ledger`, formData);

export const getFirms = () => API.get(`/api/admin/get-firms`);

export const getClientsByFirm = (formData) => API.post(`/api/admin/get-clients-by-firm`, formData);

export const getAllClient = () => API.get(`/api/admin/get-allClient`);

export const updateClientLedger = (formData) => API.put(`/api/admin/update-client-ledger/${formData.id}`, formData.formData);

export const getClientInfo = (id) => API.get(`/api/admin/get-client-info/${id}`);

// ------------------------------ Manage client trust account -----------------------------------------------

export const getAllClientTrustAccount = () => API.get(`/api/admin/get-client-accounts`);

export const createTrustAccount = (formData) => API.post(`/api/admin/add-client-account`, formData);

export const updateTrustAccount = (clientId, formData) => API.put(`/api/admin/update-client-account/${clientId}`, formData);

export const deleteTrustAccount = (clientId) => API.delete(`/api/admin/delete-client-account/${clientId}`);

// --------------------------------- Manage notifications -----------------------------------------------

export const getNotifications = () => API.get(`/api/admin/get-admin-notifications`);

export const markNotificationRead = (formData) => API.put(`/api/admin/mark-notification-as-read`, formData);


// --------------------------------- Manage Role PermissionSlice -----------------------------------------------

export const getAllAdminRoles = () => API.get(`/api/admin/get-roles`);

export const createAdminRoles = (formData) => API.post(`/api/admin/add-role`, formData);

export const deleteAdminRoles = (roleId) => API.put(`/api/admin/delete-role/${roleId}`);

export const getModules = () => API.get(`/api/admin/get-modules`);

export const getMenuByModule = (formData) => API.post(`/api/admin/get-menu-by-module`, formData);

export const asignMenuPermission = (formData) => API.post(`/api/admin/role-menu-permission`, formData);

export const createNewUser = (formData) => API.post(`/api/admin/add-usermanagement`, formData);

export const viewPermission = () => API.get(`/api/admin/get-user-permissions`);

export const getAllRoles = () => API.get(`/api/admin/get-roles`);

export const getSelectedModuleByRoleId = (role_id) => API.get(`/api/admin/get-module-by-role/${role_id}`);
export const updateRole = (role_id, formData) => {
  return API.put(`/api/admin/update-role/${role_id}`, formData);
};


// --------------------------------- Case api endpoints -----------------------------------------------
export const getAllCases = () => API.get(`/api/user/case`);
export const addNewCase = (formData) => API.post(`/api/user/case/create`, formData);
export const getCaseInfo = (case_id) => API.get(`/api/user/get-case-info/${case_id}`);
