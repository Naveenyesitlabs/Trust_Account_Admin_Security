import { Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  createUsers,
  getAllUsers,
  updateUsers,
} from "../redux/slices/adminSlice";
import { getStoredSession } from "../utils/authStorage";

const AddEditUser = ({ editData }) => {
  // 🔹 Reference for Bootstrap modal DOM element
  const modalRef = useRef(null);

  // 🔹 Redux dispatch
  const dispatch = useDispatch();

  // 🔹 Fetch logged-in admin data from localStorage
  const admin = getStoredSession();

  // 🔹 Extract admin_id for API usage
  const admin_id = admin?.user?.userid || 0;

  // 🔹 Loader state when submitting
  const [proccessing, setProccessing] = useState(false);

  // 🔹 Formik initial values (edit mode vs add mode)
  const initialValues = {
    name: editData?.name || "",
    email: editData?.email || "",
    phone: editData?.phone || "",
    assign_role: editData?.assign_role || "",
    created_by: admin?.user?.userid || 0,
  };

  // 🔹 Yup validation schema for form fields
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    assign_role: Yup.string().required("Role is required"),
  });

  // 🔹 Handle submit for Add / Edit user
  const handleSubmit = async (values, { resetForm }) => {
    setProccessing(true);

    if (editData) {
      // 🔹 Update existing user
      await dispatch(updateUsers({ id: editData.id, values }));
    } else {
      // 🔹 Create new user
      await dispatch(createUsers(values));
    }

    // 🔹 Refresh user list after any change
    await dispatch(getAllUsers({ admin_id }));

    setProccessing(false);

    // 🔹 Reset form after submit
    resetForm();

    // 🔹 Close Bootstrap modal programmatically
    if (modalRef.current) {
      const modal =
        bootstrap.Modal.getInstance(modalRef.current) ||
        new bootstrap.Modal(modalRef.current);
      modal.hide();
    }
  };

  return (
    <div
      className="modal animate__animated animate__bounceIn my-popup"
      id="add-pop"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      data-bs-backdrop="static"
      ref={modalRef} // 🔹 Attach modalRef for programmatic control
    >
      <div className="modal-dialog modal-dialog-edit" role="document">
        <div className="modal-content clearfix">
          {/* 🔹 Modal Header */}
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">
                <img src="images/cross-pop.svg" alt="close" />
              </span>
            </button>
          </div>

          {/* 🔹 Modal Body */}
          <div className="modal-body">
            <div className="delete-pop-wrap">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true} // 🔹 Updates form values if editData changes
              >
                {({ errors, touched }) => (
                  <Form>
                    {/* 🔹 Modal Title */}
                    <div className="delete-pop-inner gap-1">
                      <h3>{editData ? "Edit" : "Add"}</h3>
                    </div>

                    {/* 🔹 Form Fields */}
                    <div className="edit-pop-form mt-5">
                      {/* Name */}
                      <div className="edit-pop-in">
                        <label>Name</label>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Enter Name"
                          className="edit-field"
                        />
                        {errors.name && touched.name && (
                          <div className="error" style={errorStyle}>
                            {errors.name}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="edit-pop-in">
                        <label>Email</label>
                        <Field
                          type="text"
                          name="email"
                          placeholder="Enter Email"
                          className="edit-field"
                        />
                        {errors.email && touched.email && (
                          <div className="error" style={errorStyle}>
                            {errors.email}
                          </div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="edit-pop-in">
                        <label>Phone</label>
                        <Field
                          type="text"
                          name="phone"
                          placeholder="Enter Phone"
                          className="edit-field"
                        />
                        {errors.phone && touched.phone && (
                          <div className="error" style={errorStyle}>
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      {/* Assign Role */}
                      <div className="edit-pop-in">
                        <label>Assign role</label>
                        <Field
                          as="select"
                          name="assign_role"
                          className="edit-field edit-select"
                        >
                          <option value="">Select role</option>
                          {/* 🔹 Predefined roles */}
                          <option value="attorney">Attorney</option>
                          <option value="accountant">Accountant</option>
                          <option value="user">User</option>
                        </Field>
                        {errors.assign_role && touched.assign_role && (
                          <div className="error" style={errorStyle}>
                            {errors.assign_role}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="delete-pop-btn mt-4">
                        <button
                          type="submit"
                          className="btn"
                          style={submitButtonStyle}
                        >
                          {proccessing
                            ? "Please wait..." // 🔹 Show loader text while processing
                            : editData
                              ? "Update" // 🔹 Edit button text
                              : "Save"} {/* 🔹 Add button text */}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Inline styles for error messages
const errorStyle = {
  color: "red",
  fontSize: "12px",
  paddingLeft: "5px",
};

// 🔹 Inline styles for submit button
const submitButtonStyle = {
  border: "none",
  borderRadius: "30px",
  backgroundColor: "#030f23",
  color: "#fff",
  fontSize: "15px",
  fontWeight: "500",
  textAlign: "center",
  textDecoration: "none",
  outline: "none",
  padding: "10px 50px",
};

export default AddEditUser;
