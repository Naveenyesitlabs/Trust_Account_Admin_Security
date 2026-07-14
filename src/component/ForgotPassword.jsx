import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { checkOtp, newPassword, sendOtp } from "../redux/slices/adminSlice";

// 🔹 ForgotPassword Component
// - Multi-step modal handling: Forgot Password → OTP Verification → Reset Password
// - Props:
//   • show → boolean to control modal visibility
//   • handleClose → function to close modal

const ForgotPassword = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  // 🔹 State variables
  const [timer, setTimer] = useState(60); // Countdown for OTP resend (seconds)
  const [resendEnabled, setResendEnabled] = useState(false); // Controls resend button
  const [step, setStep] = useState(1); // Step control: 1 → Forgot Password, 2 → OTP, 3 → Reset Password
  const [email, setEmail] = useState(""); // Store user email for OTP & reset
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [proccessing, setProccessing] = useState(false); // Loading state

  // 🔹 Toggle password visibility for inputs
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  // 🔹 Countdown timer for OTP resend
  useEffect(() => {
    if (timer <= 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // 🔹 Formik for Step 1: Forgot Password (send OTP)
  const forgotPassFormik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
    }),
    onSubmit: async (values) => {
      setProccessing(true);
      const result = await dispatch(sendOtp(values)); // Trigger send OTP API
      setProccessing(false);
      if (result.payload?.success) {
        setEmail(values.email);
        setStep(2); // Move to OTP step
      } else {
        setStep(1);
      }
    }
  });

  // 🔹 Formik for Step 2: OTP Verification
  const verifyOtpFormik = useFormik({
    initialValues: { otp1: '', otp2: '', otp3: '', otp4: '' },
    validationSchema: Yup.object({
      otp1: Yup.number().required('OTP is required'),
      otp2: Yup.number().required('OTP is required'),
      otp3: Yup.number().required('OTP is required'),
      otp4: Yup.number().required('OTP is required'),
    }),
    onSubmit: async (values) => {
      const otp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
      setProccessing(true);
      const result = await dispatch(checkOtp({ email: email, otp: otp }));
      setProccessing(false);
      if (result.payload?.success) {
        setStep(3); // Move to Reset Password
      } else {
        setStep(2);
      }
    }
  });

  // 🔹 Formik for Step 3: Reset Password
  const resetPassFormik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
    }),
    onSubmit: async (values) => {
      setProccessing(true);
      const result = await dispatch(newPassword({ email: email, newPassword: values.password, confirmPassword: values.confirmPassword }));
      setProccessing(false);
      if (result.payload?.success) {
        handleClose();
        forgotPassFormik.resetForm();
        verifyOtpFormik.resetForm();
        resetPassFormik.resetForm();
      }
      setStep(1); // Reset modal to first step
    }
  });

  // 🔹 Helper: format countdown timer as MM:SS
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  // 🔹 Resend OTP handler
  const handleResendOtp = (e) => {
    e.preventDefault();
    if (!resendEnabled) return;

    setProccessing(true);
    dispatch(sendOtp({ email: email })); // Trigger resend OTP
    setProccessing(false);

    setTimer(60); // Reset countdown
    setResendEnabled(false);
  };

  // 🔹 OTP input refs for auto-focus
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // 🔹 Handle OTP input change
  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d$/.test(value)) {
      verifyOtpFormik.setFieldValue(`otp${index + 1}`, value);
      setTimeout(() => {
        if (index < otpRefs.length - 1) otpRefs[index + 1].current.focus(); // Auto focus next field
      }, 0);
    } else if (value === '') {
      verifyOtpFormik.setFieldValue(`otp${index + 1}`, '');
    }
  };

  // 🔹 Handle OTP key navigation (Backspace & Arrow keys)
  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (verifyOtpFormik.values[`otp${index + 1}`]) {
        verifyOtpFormik.setFieldValue(`otp${index + 1}`, '');
      } else if (index > 0) {
        otpRefs[index - 1].current.focus();
      }
    }
    if (e.key === "ArrowRight" && index < otpRefs.length - 1) otpRefs[index + 1].current.focus();
    if (e.key === "ArrowLeft" && index > 0) otpRefs[index - 1].current.focus();
  };

  // 🔹 Inline styles for input fields and labels
  const inputStyle = {
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1.5px solid #000',
    width: '100%',
    color: 'black',
    backgroundColor: 'white',
    outline: 'none',
    boxShadow: 'none',
  };
  const labelStyle = {
    position: 'absolute',
    top: '60px',
    left: '28px',
    background: 'white',
    padding: '0 5px',
    fontSize: '16px',
    color: '#000429',
    zIndex: 1
  }

  // 🔹 Modal JSX
  return (
    <>
      <Modal
        centered
        size="md"
        show={show}
        onHide={() => {
          setStep(1);
          forgotPassFormik.resetForm();
          verifyOtpFormik.resetForm();
          resetPassFormik.resetForm();
          handleClose();
        }}
        dialogClassName="custom-forgot-modal"
      >
        {/* 🔹 Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderRadius: "10px", maxWidth: "100%" }}>
          <div className="close-btns" onClick={() => { setStep(1); handleClose() }}>X</div>
        </div>

        <Modal.Header className="border-0 pb-0">
          <Modal.Title className="w-100 text-center fw-bold fs-2 text-dark mb-4">
            {step === 1 ? "Forgot Password" : step === 2 ? "Verification Code" : "Reset Password"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center pt-2">
          {/* 🔹 Step 1: Forgot Password */}
          {step === 1 && (
            <>
              <p className="text-muted mb-4">Enter the Email/Phone number associated with your account.</p>
              <Form onSubmit={forgotPassFormik.handleSubmit}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Email/Phone</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your Email/Phone"
                    required
                    style={inputStyle}
                    value={forgotPassFormik.values.email}
                    {...forgotPassFormik.getFieldProps("email")}
                  />
                  {forgotPassFormik.touched.email && forgotPassFormik.errors.email && (
                    <div className="text-danger">{forgotPassFormik.errors.email}</div>
                  )}
                </Form.Group>
                <button type="submit" className="login-btn mt-4 w-40" disabled={proccessing}>
                  {proccessing ? "Processing..." : "Submit"}
                </button>
              </Form>
            </>
          )}

          {/* 🔹 Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={verifyOtpFormik.handleSubmit}>
              <div className="signup-form">
                <div className="form-fields">
                  <div className="input-grp otp-container">
                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        name={`otp${i + 1}`}
                        maxLength="1"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={verifyOtpFormik.values[`otp${i + 1}`]}
                        onChange={(e) => handleOtpChange(e, i)}
                        onKeyDown={(e) => handleOtpKeyDown(e, i)}
                        className="otp-input"
                      />
                    ))}
                  </div>
                  {(verifyOtpFormik.touched.otp1 && verifyOtpFormik.errors.otp1) ||
                    (verifyOtpFormik.touched.otp2 && verifyOtpFormik.errors.otp2) ||
                    (verifyOtpFormik.touched.otp3 && verifyOtpFormik.errors.otp3) ||
                    (verifyOtpFormik.touched.otp4 && verifyOtpFormik.errors.otp4) && (
                      <div className="text-danger">{verifyOtpFormik.errors.otp1 || verifyOtpFormik.errors.otp2 || verifyOtpFormik.errors.otp3 || verifyOtpFormik.errors.otp4}</div>
                    )}
                </div>

                {/* 🔹 Resend OTP */}
                <div style={{ textAlign: "right", marginTop: "20px" }}>
                  <button
                    className="bg-transparent border-none"
                    onClick={handleResendOtp}
                    disabled={!resendEnabled}
                    style={{ fontSize: "13px", fontFamily: "poppins", marginRight: "60px", cursor: resendEnabled ? "pointer" : "not-allowed", color: resendEnabled ? "#007bff" : "#999", border: "none" }}
                  >
                    Resend OTP
                  </button>
                </div>
                {!resendEnabled && (
                  <div style={{ fontSize: "16px", fontFamily: "poppins", color: "#555" }}>
                    Resend verification code in {formatTime(timer)} secs
                  </div>
                )}
                <button type="submit" className="login-btn mt-4 w-40" disabled={proccessing}>
                  {proccessing ? "Processing..." : "Submit"}
                </button>
              </div>
            </form>
          )}

          {/* 🔹 Step 3: Reset Password */}
          {step === 3 && (
            <Form onSubmit={resetPassFormik.handleSubmit}>
              <Form.Group>
                <Form.Label className="float-start">Create Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    value={resetPassFormik.values.password}
                    placeholder="Create a new password"
                    {...resetPassFormik.getFieldProps("password")}
                  />
                  <Button variant="outline-secondary" onClick={togglePasswordVisibility} type="button" className="forgot-pass-eye">
                    <i className={`fas ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
                  </Button>
                </InputGroup>
                {resetPassFormik.touched.password && resetPassFormik.errors.password && (
                  <div className="text-danger">{resetPassFormik.errors.password}</div>
                )}
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label className="float-start">Confirm Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={confirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    value={resetPassFormik.values.confirmPassword}
                    placeholder="Confirm your password"
                    {...resetPassFormik.getFieldProps("confirmPassword")}
                  />
                  <Button variant="outline-secondary" onClick={toggleConfirmPasswordVisibility} type="button" className="forgot-pass-eye">
                    <i className={`fas ${confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`} />
                  </Button>
                </InputGroup>
                {resetPassFormik.touched.confirmPassword && resetPassFormik.errors.confirmPassword && (
                  <div className="text-danger">{resetPassFormik.errors.confirmPassword}</div>
                )}
              </Form.Group>

              <button type="submit" className="login-btn mt-4 w-100" disabled={proccessing}>
                {proccessing ? "Processing..." : "Submit"}
              </button>
            </Form>
          )}
        </Modal.Body >
      </Modal >

      {/* 🔹 Inline CSS for modal & OTP styling */}
      <style>{`
        .custom-forgot-modal .modal-content { border-radius: 20px; padding: 1rem 2rem; box-shadow: 0 0 25px rgba(0, 0, 0, 0.1); color:black }
        .otp-input { border: 1px solid #ced4da; border-radius: 0.5rem; text-align: center; font-size: 1.5rem; height: 50px; width: 50px; }
        .modal-body p { font-size: 0.95rem; }
        .form-label { font-weight: 500; }
        .close-btn { backgroundColor: #3182CE; color: #fff; }
        .otp-input { width: 25px; height: 25px; font-size: 1.2rem; text-align: center; border: none; border-radius: 8px; transition: 0.2s ease; outline: none; background-color: #fdfdfd; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); }
        .otp-input:focus { outline: none; box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); background-color: #ffffff; }
        .otp-input-group { justify-content: center; }
      `}</style>
    </>
  );
};

export default ForgotPassword;
