import { Field, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  asignMenuPermission,
  getAllAdminRoles,
  getMenuByModule,
  getModules,
  getSelectedModuleByRoleId,
  resetMenuModule
} from "../redux/slices/RolePermissionSlice";

/**
 * Component for assigning roles and configuring permissions
 */
const AssignRole = () => {
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // React Router navigation
  const { adminRoles, modules, menuModule } = useSelector(
    (state) => state.adminRoles // extract state slices from Redux
  );

  // Local state
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedRoleModules, setSelectedRoleModules] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [permissionsData, setPermissionsData] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(); // ref for handling clicks outside dropdown

  // Initial reset on mount
  useEffect(() => {
    dispatch(resetMenuModule()); // reset Redux menu module state
    setSelectedModules([]);
    setSelectedRoleModules([]);
    setSelectedRoleId(null);
    setPermissionsData([]);
  }, []);

  // Fetch modules and admin roles on mount
  // Also handle click outside dropdown to close it
  useEffect(() => {
    dispatch(getModules());
    dispatch(getAllAdminRoles());

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // close dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // Update permissionsData when menuModule changes
  useEffect(() => {
    if (menuModule.length) {
      const clonedData = menuModule.map((item) => ({ ...item }));
      setPermissionsData(clonedData);
    } else {
      setPermissionsData([]);
    }
  }, [menuModule]);

  // Set role options when adminRoles load
  useEffect(() => {
    if (adminRoles?.length) {
      setRoleOptions(adminRoles);
    }
  }, [adminRoles]);

  /**
   * Handle module checkbox toggle
   * Updates selectedModules state and fetches menu items for the role
   */
  const handleModuleChange = (module, setFieldValue) => {
    let updatedModules;
    if (selectedModules.includes(module)) {
      updatedModules = selectedModules.filter((m) => m !== module); // remove module if already selected
    } else {
      updatedModules = [...selectedModules, module]; // add module
    }

    setSelectedModules(updatedModules);
    setFieldValue("modules", updatedModules); // update Formik field

    // Fetch menu items if a role is selected
    if (selectedRoleId !== null) {
      if (updatedModules.length === 0) {
        setPermissionsData([]); // clear table if no modules
      } else {
        dispatch(
          getMenuByModule({
            menu_module: updatedModules,
            role_id: selectedRoleId,
          })
        );
      }
    }
  };

  /**
   * Handle role selection change
   * Fetches modules and menu items associated with selected role
   */
  const handleRoleChange = async (e, setFieldValue) => {
    const roleId = parseInt(e.target.value);
    setSelectedRoleId(roleId);
    setFieldValue("role", roleId);
    setSelectedModules([]);
    setPermissionsData([]);

    if (roleId) {
      try {
        const response = await dispatch(getSelectedModuleByRoleId(roleId)).unwrap();
        if (response?.data?.length > 0) {
          const modules = response.data;
          setSelectedRoleModules(modules);
          setSelectedModules(modules);

          await dispatch(getMenuByModule({
            menu_module: modules,
            role_id: roleId,
          }));
        } else {
          setSelectedRoleModules([]);
          setSelectedModules([]);
          setPermissionsData([]);
        }
      } catch (error) {
        console.error("Failed to load role modules:", error);
        toast.error("Failed to load modules for the selected role.");
      }
    }
  };

  /**
   * Handle permission checkbox changes
   * Enforces business rules:
   * - If Add/Edit/Delete is selected, Read must also be selected
   * - If Read is unchecked, Add/Edit/Delete are unchecked
   */
  const handleCheckboxChange = (index, permissionType) => {
    const updatedPermissions = [...permissionsData];
    updatedPermissions[index][permissionType] =
      updatedPermissions[index][permissionType] === 1 ? 0 : 1;

    const hasAdd = updatedPermissions[index]["has_add_permission"];
    const hasEdit = updatedPermissions[index]["has_edit_permission"];
    const hasDelete = updatedPermissions[index]["has_delete_permission"];

    // Ensure Read is checked if Add/Edit/Delete is checked
    if (
      (permissionType === "has_add_permission" ||
        permissionType === "has_edit_permission" ||
        permissionType === "has_delete_permission") &&
      (hasAdd === 1 || hasEdit === 1 || hasDelete === 1)
    ) {
      updatedPermissions[index]["has_read_permission"] = 1;
    }

    // If Read is unchecked, uncheck Add/Edit/Delete
    if (
      permissionType === "has_read_permission" &&
      updatedPermissions[index]["has_read_permission"] === 0
    ) {
      updatedPermissions[index]["has_add_permission"] = 0;
      updatedPermissions[index]["has_edit_permission"] = 0;
      updatedPermissions[index]["has_delete_permission"] = 0;
    }

    setPermissionsData(updatedPermissions);
  };

  /**
   * Handle form submission
   * Dispatches asignMenuPermission to save permissions
   * Resets local and Formik state after successful submission
   */
  const handleSubmit = async (values, resetForm) => {
    if (!selectedRoleId) {
      toast.error("Please select a role before saving permissions.");
      return;
    }

    const payload = {
      role_id: selectedRoleId,
      permissions: permissionsData.map((item) => ({
        menu_id: item.id,
        has_read_permission: item.has_read_permission,
        has_add_permission: item.has_add_permission,
        has_edit_permission: item.has_edit_permission,
        has_delete_permission: item.has_delete_permission,
      })),
    };

    try {
      await dispatch(asignMenuPermission(payload)).unwrap();
      toast.success("Access given to role successfully");

      // Reset Formik and local state
      resetForm();
      setSelectedModules([]);
      setSelectedRoleModules([]);
      setSelectedRoleId(null);
      setPermissionsData([]);
      dispatch(resetMenuModule());
      setDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to assign role permissions.");
      console.error("assignMenuPermission error", error);
    }
  };

  return (
    <main>
      <div className="influ-in">
        <div className="assign-access cmn-cd-bg mb30">
          <div className="sec-head">
            <h1 className="h2-title">Assign Access</h1>
          </div>

          <div className="assign-access-form-wrp">
            <Formik
              initialValues={{ role: "", modules: [] }}
              onSubmit={async (values, { resetForm }) => {
                await handleSubmit(values, resetForm);
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  {/* Step 1 & 2: Select Role and Module */}
                  <div className="assign-access-form">
                    <div className="multi-grp">
                      {/* Role Selection */}
                      <div className="input-grp-role">
                        <label>Step 1: Select Role</label>
                        <Field
                          as="select"
                          name="role"
                          onChange={(e) => handleRoleChange(e, setFieldValue)}
                        >
                          <option value="">Select Role</option>
                          {roleOptions.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Module Selection */}
                      <div className="input-grp-role" ref={dropdownRef}>
                        <label>Step 2: Select Module</label>
                        <div
                          className="custom-select-box"
                          onClick={() => setDropdownOpen(!dropdownOpen)}
                          style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            background: "#fff",
                            position: "relative",
                          }}
                        >
                          {selectedModules.length > 0
                            ? selectedModules.join(", ")
                            : "Select Modules"}
                          <span style={{ float: "right" }}>▼</span>
                        </div>
                        {dropdownOpen && (
                          <div
                            className="dropdown-options"
                            style={{
                              border: "1px solid #ccc",
                              borderTop: "none",
                              position: "absolute",
                              zIndex: "10",
                              background: "#fff",
                              width: "100%",
                              maxHeight: "150px",
                              overflowY: "auto",
                            }}
                          >
                            {modules?.map((mod, index) => (
                              <label
                                key={index}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "8px",
                                  borderBottom: "1px solid #eee",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedRoleModules.includes(mod.module) ||
                                    selectedModules.includes(mod.module)
                                  }
                                  onChange={() =>
                                    handleModuleChange(mod.module, setFieldValue)
                                  }
                                  style={{ marginRight: "8px" }}
                                />
                                {mod.module}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Permissions Table */}
                  <div className="admin-cmn-bdy-panel mt-4">
                    <div className="permission-form-wrp">
                      <div className="permission-form">
                        <div className="sec-head-wrp">
                          <div className="sec-head">
                            <h2>Configure Permissions</h2>
                          </div>
                          <div className="btn-wrp">
                            <button
                              type="reset"
                              className="cmn-btn"
                              onClick={() => navigate("/view-assign-role")}
                            >
                              View Permissions
                            </button>
                            <button type="submit" className="cmn-btn">
                              Save Permissions
                            </button>
                          </div>
                        </div>

                        <div className="admin-cmn-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Component</th>
                                <th>Read</th>
                                <th>Add</th>
                                <th>Edit</th>
                                <th>Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              {permissionsData.length > 0 ? (
                                permissionsData.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    {[
                                      "has_read_permission",
                                      "has_add_permission",
                                      "has_edit_permission",
                                      "has_delete_permission",
                                    ].map((permKey) => (
                                      <td key={permKey}>
                                        <label className="cstm-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={item[permKey] === 1}
                                            onChange={() =>
                                              handleCheckboxChange(
                                                index,
                                                permKey
                                              )
                                            }
                                          />
                                          <span className="checkbox-design">
                                            {item[permKey] === 1 && (
                                              <img
                                                src="./images/checkbox-checked.svg"
                                                alt="Checked"
                                              />
                                            )}
                                          </span>
                                        </label>
                                      </td>
                                    ))}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="5"
                                    style={{
                                      textAlign: "center",
                                      padding: "1rem",
                                    }}
                                  >
                                    No permissions available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AssignRole;
