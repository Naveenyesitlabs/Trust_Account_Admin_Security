import { Field, Form, Formik } from "formik"; // Formik for form handling
import { useEffect, useState } from "react"; // React hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // Navigation hook
import AddUserModal from "../component/AddUserModal"; // Modal to add new user
import ViewPermissionsModal from "../component/ViewPermissionsModal"; // Modal to view permissions
import {
  getAllAdminRoles,
  getModules,
  viewPermission
} from "../redux/slices/RolePermissionSlice"; // Redux actions for roles and permissions

const ViewAssignedRoles = () => {
  const navigate = useNavigate(); // Navigation
  const dispatch = useDispatch(); // Redux dispatch

  const { permission, adminRoles, modules } = useSelector(
    (state) => state.adminRoles
  ); // Get permissions, roles, and modules from Redux state

  const [roleOptions, setRoleOptions] = useState([]); // Options for role dropdown
  const [filteredData, setFilteredData] = useState([]); // Filtered permission list
  const [selectedUser, setSelectedUser] = useState(null); // User selected to view permissions


  // On mount, fetch all required data
  useEffect(() => {
    dispatch(viewPermission()); // Fetch all permissions
    dispatch(getAllAdminRoles()); // Fetch all admin roles
    dispatch(getModules()); // Fetch all modules
  }, [dispatch]);

  // Update local state when Redux data changes
  useEffect(() => {
    if (permission?.length) {
      setFilteredData(permission); // Set initial filtered data
    }
    if (adminRoles?.length) {
      setRoleOptions(adminRoles); // Set role dropdown options
    }
  }, [permission, adminRoles]);

  // Handler when permission view button is clicked
  const handlePermissionClick = (userData) => {
    setSelectedUser(userData); // Set selected user for modal
  };

  return (
    <main>
      <div className="influ-in">
        <div className="admin-cmn-bdy-panel">
          <div className="sec-head-wrp">
            {/* Section header with back button */}
            <div className="sec-head df">
              <a className="back-btn" onClick={() => navigate("/assign-role")}>
                <img src="./images/back-icon.svg" alt="Icon" />
              </a>
              <h1 className="h2-title">View Assigned Roles</h1>
            </div>

            {/* Filter and search form */}
            <div className="ad-filter-search-form-wrp">
              <Formik
                initialValues={{ search: "", module: "", role: "" }}
                onSubmit={() => { }} // No-op submit handler
              >
                {({ values, setFieldValue }) => {
                  // Effect to filter data whenever form values or permission list changes
                  useEffect(() => {
                    let result = permission;

                    // Search filter by user_name, role, or assigned_modules
                    if (values.search?.trim()) {
                      const keyword = values.search.toLowerCase();
                      result = result.filter(
                        (item) =>
                          item.user_name.toLowerCase().includes(keyword) ||
                          item.role.toLowerCase().includes(keyword) ||
                          item.assigned_modules
                            ?.join(", ")
                            .toLowerCase()
                            .includes(keyword)
                      );
                    }

                    // Module filter
                    if (values.module) {
                      result = result.filter((item) =>
                        item.assigned_modules?.includes(values.module)
                      );
                    }

                    // Role filter
                    if (values.role) {
                      result = result.filter((item) =>
                        item.role
                          .toLowerCase()
                          .includes(values.role.toLowerCase())
                      );
                    }

                    setFilteredData(result); // Update filtered data
                  }, [values, permission]);

                  return (
                    <Form>
                      <div className="ad-filter-search-form">
                        <div className="ad-filter-wrp">
                          {/* Search input */}
                          <div className="ad-search-bar">
                            <Field
                              type="text"
                              name="search"
                              placeholder="Search"
                            />
                            <button type="submit">
                              <img src="./images/search-icon.svg" alt="Icon" />
                            </button>
                          </div>

                          {/* Module and role dropdowns */}
                          <div className="ad-filter-right-part">
                            <div className="multi-grp">
                              <div className="btn-wrp">
                                <Field
                                  as="select"
                                  name="module"
                                  style={{
                                    background: "#101949",
                                    color: "white",
                                    borderRadius: "50px",
                                    padding: "10px 20px",
                                    minHeight: "48px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    border: "1px solid #101949",
                                    justifyContent: "center",
                                    transition: "all ease-in-out 0.3s",
                                  }}
                                >
                                  <option value="">Select Module</option>
                                  {modules?.map((mod, idx) => (
                                    <option key={idx} value={mod.module}>
                                      {mod.module}
                                    </option>
                                  ))}
                                </Field>
                              </div>

                              <div className="btn-wrp">
                                <Field
                                  as="select"
                                  name="role"
                                  style={{
                                    background: "#101949",
                                    color: "white",
                                    borderRadius: "50px",
                                    padding: "10px 20px",
                                    minHeight: "48px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    border: "1px solid #101949",
                                    justifyContent: "center",
                                    transition: "all ease-in-out 0.3s",
                                  }}
                                >
                                  <option value="">Select Role</option>
                                  {roleOptions.map((role) => (
                                    <option
                                      key={role.serial_no}
                                      value={role.name}
                                    >
                                      {role.name}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </div>

                            {/* Add New User Button */}
                            <div className="btn-wrp">
                              <button
                                type="button"
                                className="cmn-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#addUser"
                              >
                                Add New User
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>

          {/* Table displaying assigned roles */}
          <div className="admin-cmn-table count-row">
            <table>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Assigned Modules</th>
                  <th>Assigned Permissions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.user_name}</td>
                      <td>{item.role}</td>
                      <td>{item.assigned_modules?.join(", ") || "-"}</td>
                      <td>
                        {/* View permissions modal button */}
                        <button
                          className="view-permission-btn"
                          data-bs-toggle="modal"
                          data-bs-target="#viewPermissions"
                          onClick={() => handlePermissionClick(item)}
                        >
                          <img src="./images/eye-icon.svg" alt="Eye Icon" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{ textAlign: "center", color: "black" }}
                    >
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <AddUserModal /> {/* Modal to add new user */}
        <ViewPermissionsModal user={selectedUser || {}} /> {/* Modal to view permissions of selected user */}
      </div>
    </main>
  );
};

export default ViewAssignedRoles;
