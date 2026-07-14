import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  createAdminRoles,
  deleteAdminRoles,
  getAllAdminRoles,
  updateAdminRoles, // <-- Redux action to update existing role
} from "../redux/slices/RolePermissionSlice";

/**
 * Component for creating, updating, and managing admin roles
 */
const CreateNewRole = () => {
  const navigate = useNavigate(); // For programmatic navigation
  const dispatch = useDispatch(); // Redux dispatch

  // Redux state
  const { adminRoles, loading, error } = useSelector(
    (state) => state.adminRoles
  );

  // Local state
  const [roles, setRoles] = useState([]); // Local copy of roles
  const [selectedRole, setSelectedRole] = useState(null); // Role currently being edited
  const [buttontext, setButtonText] = useState("Create Role"); // Submit button text
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
  }); // Formik initial values for form fields

  // Schema for Formik validation
  const RoleSchema = Yup.object().shape({
    name: Yup.string().required("Role Name is required"),
    description: Yup.string().required("Description is required"),
  });

  /**
   * Fetch all roles on component mount
   */
  useEffect(() => {
    dispatch(getAllAdminRoles());
  }, [dispatch]);

  /**
   * Sync roles from Redux state to local state whenever they change
   */
  useEffect(() => {
    if (adminRoles) {
      setRoles(adminRoles);
    }
  }, [adminRoles]);

  /**
   * Handles form submission for creating or updating a role
   */
  const handleSubmit = (values, { resetForm }) => {
    if (selectedRole) {
      // Update existing role
      const updatedRole = { name: values.name, description: values.description };
      dispatch(updateAdminRoles({ roleId: selectedRole.id, data: updatedRole }))
        .unwrap()
        .then(() => {
          // Reset form and local state after update
          resetForm();
          setSelectedRole(null);
          setButtonText("Create Role");
          setFormValues({ name: "", description: "" });
          dispatch(getAllAdminRoles()); // Refresh role list
        })
        .catch((error) => {
          console.error("Update role failed:", error);
        });

    } else {
      // Create new role
      const newRole = {
        id: roles.length + 1, // Temporary ID for new role (can be replaced by backend ID)
        serial_no: roles.length + 1, // Optional serial number
        ...values,
      };
      dispatch(createAdminRoles(newRole))
        .unwrap()
        .then(() => {
          resetForm();
          setFormValues({ name: "", description: "" });
          dispatch(getAllAdminRoles()); // Refresh role list
        })
        .catch((error) => {
          console.error("Create role failed:", error);
        });
    }
  };

  /**
   * Navigate to Assign Role page
   */
  const handleAsign = () => {
    navigate("/assign-role");
  };

  /**
   * Delete a role
   */
  const handleDelete = (roleId) => {
    dispatch(deleteAdminRoles(roleId))
      .unwrap()
      .then(() => {
        dispatch(getAllAdminRoles()); // Refresh role list
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  /**
   * Load role data into form for editing
   */
  const handleUpdate = (role) => {
    setSelectedRole(role); // Set role to edit
    setButtonText("Update Role"); // Change button text
    setFormValues({
      name: role.name,
      description: role.description,
    }); // Populate form fields
  };

  return (
    <main>
      <div className="influ-in">
        {/* Create / Update Role Form */}
        <div className="create-role">
          <div className="sec-head">
            <h1 className="h2-title">Create New Roles</h1>
          </div>

          <div className="create-role-form-wrp">
            <Formik
              enableReinitialize // Allow form to reinitialize when formValues change
              initialValues={formValues}
              validationSchema={RoleSchema}
              onSubmit={handleSubmit}
            >
              {({ touched, errors }) => (
                <Form>
                  <div className="create-role-form">
                    <div className="multi-grp">
                      {/* Role Name Field */}
                      <div className="input-grp_">
                        <label>Role Name</label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Role Name"
                          className={touched.name && errors.name ? "error" : ""}
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="error"
                        />
                      </div>

                      {/* Description Field */}
                      <div className="input-grp_">
                        <label>Description</label>
                        <Field
                          type="text"
                          name="description"
                          placeholder="Description"
                          className={
                            touched.description && errors.description
                              ? "error"
                              : ""
                          }
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="btn-wrp">
                    <div className="create-role-btn-wrp">
                      <button type="submit" className="cmn-btn">
                        {buttontext}
                      </button>
                    </div>
                    <div className="create-role-btn-wrp">
                      <button
                        type="button"
                        className="cmn-btn"
                        onClick={handleAsign}
                      >
                        Assign Role
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Existing Roles Section */}
        <div className="existing-role">
          <div className="sec-head">
            <h2>Existing Roles</h2>
          </div>

          {/* Loading, error, or display roles */}
          {loading ? (
            <p>Loading roles...</p>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : roles.length === 0 ? (
            <p>No roles found.</p>
          ) : (
            <div className="existing-role-cards-wrp">
              {roles.map((role, index) => (
                <div className="existing-role-card cmn-cd-bg" key={index}>
                  <div className="existing-role-cd-left">
                    <div className="existing-role-info">
                      <h3 className="h5-title">{role.name}</h3>
                      <p>{role.description}</p>
                    </div>
                  </div>
                  <div className="existing-role-cd-right">
                    {/* Edit Role Button */}
                    <button
                      type="button"
                      className="cmn-btn mx-3"
                      onClick={() => handleUpdate(role)}
                    >
                      Edit
                    </button>

                    {/* Delete Role Button */}
                    <button
                      type="button"
                      className="cmn-btn"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CreateNewRole;
