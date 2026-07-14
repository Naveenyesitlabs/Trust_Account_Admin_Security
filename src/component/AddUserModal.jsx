import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { createNewUser, fetchRoles } from "../redux/slices/RolePermissionSlice";
import { getAllUsers, updateUsers } from "../redux/slices/adminSlice";
import { getStoredSession } from "../utils/authStorage";

const AddUserModal = ({ editData }) => {
  const dispatch = useDispatch();
  const isEditMode = !!editData; // 🔹 Flag: true if editing existing user

  // 🔹 Local state
  const [roles, setRoles] = useState([]); // Store roles list
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility

  // 🔹 Redux state for all roles
  const { allRoles } = useSelector((state) => state.adminRoles);

  // 🔹 Admin info from localStorage
  const admin = getStoredSession();
  const admin_id = admin?.user?.userid || 0;

  // 🔹 Default form values
  const defaultValues = {
    fullName: "",
    email: "",
    designation: "",
    password: "",
    confirmPassword: "",
    role_id: "",
  };
  const [initialValues, setInitialValues] = useState(defaultValues);

  // 🔹 Fetch roles on mount
  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  // 🔹 Sync roles from Redux to local state
  useEffect(() => {
    if (allRoles && allRoles.length > 0) {
      setRoles(allRoles);
    }
  }, [allRoles]);

  // 🔹 Populate form values when editing user
  useEffect(() => {
    if (editData) {
      setInitialValues({
        fullName: editData.name || "",
        email: editData.email || "",
        designation: editData.designation || "",
        password: "",
        confirmPassword: "",
        role_id: editData.role_id?.toString() || "",
      });
    } else {
      setInitialValues(defaultValues);
    }
  }, [editData]);

  // 🔹 Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    designation: Yup.string().required("Designation is required"),
    password: Yup.string().when([], {
      is: () => !isEditMode, // Only required when creating a new user
      then: (schema) =>
        schema
          .required("Password is required")
          .test(
            "min-length",
            "Password must be at least 8 characters",
            (value) => !value || value.length >= 8
          )
          .test(
            "uppercase",
            "Password must contain at least one uppercase letter",
            (value) => !value || /[A-Z]/.test(value)
          )
          .test(
            "lowercase",
            "Password must contain at least one lowercase letter",
            (value) => !value || /[a-z]/.test(value)
          )
          .test(
            "number",
            "Password must contain at least one number",
            (value) => !value || /[0-9]/.test(value)
          )
          .test(
            "special-char",
            "Password must contain at least one special character",
            (value) => !value || /[@$!%*?&]/.test(value)
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    confirmPassword: Yup.string().when("password", (password, schema) => {
      if (!isEditMode && password) {
        return schema
          .required("Confirm Password is required")
          .oneOf([Yup.ref("password")], "Passwords must match");
      }
      return schema.notRequired();
    }),
    role_id: Yup.string().required("Role is required"),
  });

  // 🔹 Form submission handler
  const handleSubmit = async (values, { resetForm }) => {
    const userPayload = {
      name: values.fullName,
      email: values.email,
      designation: values.designation,
      password: values.password || undefined, // Exclude password in edit mode
      role_id: values.role_id,
    };

    try {
      if (isEditMode) {
        // 🔹 Update existing user
        await dispatch(updateUsers({ id: editData.id, values: userPayload }));
      } else {
        // 🔹 Create new user
        await dispatch(createNewUser(userPayload));
      }

      // 🔹 Reset form and refresh user list
      resetForm();
      dispatch(getAllUsers({ admin_id }));

      // 🔹 Close modal programmatically
      document?.getElementById("closeAddUserBtn")?.click();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <div
      className="modal fade ad-popwrp"
      id="addUser"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* 🔹 Close button */}
          <button
            type="button"
            className="close"
            data-bs-dismiss="modal"
            aria-label="Close"
            id="closeAddUserBtn"
          >
            <span aria-hidden="true">
              <img src="./images/close-icon.svg" alt="Close" />
            </span>
          </button>

          <div className="modal-body">
            <div className="cmn-pop-inr-content-wrp">
              {/* 🔹 Modal Heading */}
              <div className="sec-head head-center">
                <h2 className="h1-title">
                  {isEditMode ? "Update User" : "Add New User"}
                </h2>
              </div>

              {/* 🔹 Form Wrapper */}
              <div className="adduser-form-wrp">
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    <div className="adduser-form">
                      {/* 🔹 Full Name & Email */}
                      <div className="multi-grp">
                        <div className="input-grp">
                          <label>Full Name</label>
                          <Field type="text" name="fullName" placeholder="Enter name" />
                          <ErrorMessage
                            name="fullName"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-grp">
                          <label>Email</label>
                          <Field type="email" name="email" placeholder="Enter email" />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>

                      {/* 🔹 Designation & Password */}
                      <div className="multi-grp">
                        <div className="input-grp">
                          <label>Designation</label>
                          <Field
                            type="text"
                            name="designation"
                            placeholder="Enter designation"
                          />
                          <ErrorMessage
                            name="designation"
                            component="div"
                            className="error-message"
                          />
                        </div>
                        <div className="input-grp">
                          <label>Password</label>
                          <Field
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter password"
                          />
                          {/* 🔹 Toggle password visibility */}
                          <div
                            className="user-password-eye"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i
                              className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}
                            />
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>

                      {/* 🔹 Confirm Password */}
                      <div className="multi-grp">
                        <div className="input-grp">
                          <label>Confirm Password</label>
                          <Field
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Enter confirm password"
                          />
                          {/* 🔹 Toggle confirm password visibility */}
                          <div
                            className="user-password-eye"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i
                              className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"}`}
                            />
                          </div>
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>

                      {/* 🔹 Role Selection */}
                      <div className="input-grp">
                        <label>Role</label>
                        <Field as="select" name="role_id">
                          <option value="">Select Role</option>
                          {roles?.map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="role_id"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    {/* 🔹 Submit Button */}
                    <div className="btn-wrp btn-center">
                      <button type="submit" className="cmn-btn">
                        {isEditMode ? "Update" : "Save"}
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
