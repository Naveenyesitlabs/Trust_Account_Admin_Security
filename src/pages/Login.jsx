import { ErrorMessage, Field, Form, Formik } from "formik"; // Formik for form handling & validation
import { useEffect, useState } from "react"; // React hooks
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // Navigation
import * as Yup from "yup"; // Validation library
import ForgotPassword from "../component/ForgotPassword"; // Component/modal for forgot password
import { login } from "../redux/slices/adminSlice"; // Redux action to perform login
import {
  clearRememberedEmail,
  getRememberedEmail,
  getStoredSession,
  storeRememberedEmail,
} from "../utils/authStorage";

const Login = () => {
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // For navigation after login
  const { loading } = useSelector((state) => state.admin); // Loading state from Redux

  // Local component state
  const savedEmail = getRememberedEmail();
  const [showModal, setShowModal] = useState(false); // Show login success modal
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showForgetModal, setShowForgetModal] = useState(false); // Show forgot password modal
  const [keepLoggedIn, setKeepLoggedIn] = useState(Boolean(savedEmail)); // Checkbox state for "Remember email"
  const loggedInUser = getStoredSession(); // Check if user already logged in

  // If user is already logged in, show login success modal
  useEffect(() => {
    if (loggedInUser) {
      setShowModal(true);
    }
  }, [loggedInUser]);

  // Initial form values, either from saved cookies or empty
  const initialValues = {
    email: savedEmail,
    password: "",
  };

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
    // Optional: commented regex for stronger password validation
  });

  // Handle login form submission
  const handleSubmit = (values) => {
    if (keepLoggedIn) {
      storeRememberedEmail(values.email);
    } else {
      clearRememberedEmail();
    }

    dispatch(
      login({
        email: values.email,
        password: values.password,
        rememberMe: keepLoggedIn,
      })
    ); // Dispatch login action
  };

  return (
    <>
      <div className="login-wrap">
        <div className="login-in">
          <div className="login-logo">
            <h1>
              Trust Account <br />
              <small>Reconciliation</small>
            </h1>
            <div className="logo">
              <img src="images/login-page/logo.svg" alt="logo" />
            </div>
          </div>

          {/* Login Form */}
          <div className="login-form">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              <Form className="animate__animated animate__bounceIn">
                <h1>Admin Login</h1>
                <hr />

                {/* Email Field */}
                <label className="login-lbl">
                  <img src="images/login-page/icons/email.svg" alt="email" />
                  <Field
                    type="email"
                    name="email"
                    className="login-txt login-custom-input"
                    placeholder="Enter your Email here"
                    autoComplete="off"
                  />
                </label>
                <ErrorMessage
                  name="email"
                  component="span"
                  style={{ color: "red", fontSize: "12px" }}
                />

                {/* Password Field */}
                <label className="login-lbl mb-0">
                  <img
                    src="images/login-page/icons/password.svg"
                    alt="password"
                  />
                  <Field
                    type={showPassword ? "text" : "password"} // Toggle visibility
                    name="password"
                    className="login-txt login-custom-input"
                    placeholder="Enter your Password"
                    autoComplete="new-password"
                  />
                  {/* Eye icon to toggle password */}
                  <div
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"
                        }`}
                    />
                  </div>
                </label>
                <ErrorMessage
                  name="password"
                  component="span"
                  style={{ color: "red", fontSize: "12px" }}
                />

                {/* Remember me checkbox & Forgot Password */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div className="rembr-me" style={{ width: "50%" }}>
                    <input
                      type="checkbox"
                      name="keepMeLoggedIn"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    />{" "}
                    Remember email
                  </div>
                  <button
                    type="button"
                    style={{
                      textDecoration: "none",
                      color: "#000",
                      backgroundColor: "transparent",
                      border: "none",
                    }}
                    onClick={() => setShowForgetModal(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </Form>
            </Formik>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPassword
        show={showForgetModal}
        handleClose={() => setShowForgetModal(false)}
      />

      {/* Login Success Modal */}
      {showModal && (
        <div
          className="modal animate__animated animate__bounceIn"
          id="login-succ"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          aria-labelledby="myModalLabel"
          data-bs-backdrop="static"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content clearfix">
              <div className="modal-body">
                <div className="logout-in">
                  <h1>Login Successful</h1>
                  <img src="images/login-page/login-succ.svg" alt="" />
                  <p>Welcome to Trust Account Reconciliation Admin panel!</p>
                  <form>
                    <button
                      type="button"
                      className="logout-in-btn"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => navigate("/manage-user")} // Navigate to dashboard
                    >
                      Okay
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
