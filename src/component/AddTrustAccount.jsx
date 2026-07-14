import "bootstrap/dist/js/bootstrap.bundle.min";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import {
  createTrustAccount,
  getAllClientTrustAccount,
  updateTrustAccount,
} from "../redux/slices/clientTrustSlice";

const AddTrustAccount = ({ currentUser }) => {
  const dispatch = useDispatch();
  const modalRef = useRef(null); // 🔹 Ref for modal DOM element

  // 🔹 Local state
  const [openDate, setOpenDate] = useState(null); // Account open date
  const [closeDate, setCloseDate] = useState(null); // Account close date
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Submit button loading
  const [loadingData, setLoadingData] = useState(true); // Loader until currentUser data loaded

  // 🔹 Sync currentUser data into date fields
  useEffect(() => {
    if (currentUser) {
      setOpenDate(
        currentUser.account_open_date
          ? new Date(currentUser.account_open_date)
          : null
      );
      setCloseDate(
        currentUser.account_close_date
          ? new Date(currentUser.account_close_date)
          : null
      );
    }
    setLoadingData(false);
  }, [currentUser]);

  // 🔹 Memoized Formik initial values to prevent unnecessary re-renders
  const initialValues = useMemo(
    () => ({
      firmName: currentUser?.firm_name || "",
      bankName: currentUser?.bank_name || "",
      accountName: currentUser?.account_name || "",
      accountNumber: currentUser?.account_number || "",
      month: currentUser?.month || new Date().getMonth() + 1,
      year: currentUser?.year || new Date().getFullYear(),
      accountOpenDate: currentUser?.account_open_date || "",
      accountCloseDate: currentUser?.account_close_date || "",
    }),
    [currentUser]
  );

  // 🔹 Yup validation schema
  const validationSchema = Yup.object({
    firmName: Yup.string().required("Firm Name is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountName: Yup.string().required("Account Name is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    month: Yup.number()
      .required("Month is required")
      .notOneOf([0], "Select a valid month"),
    year: Yup.number()
      .required("Year is required")
      .notOneOf([0], "Select a valid year"),
    accountOpenDate: Yup.date().nullable().notRequired(),
    accountCloseDate: Yup.date().nullable().notRequired(),
  });

  // 🔹 Manually close Bootstrap modal
  const closemodal = () => {
    document.body.classList.remove("modal-open");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());

    const modalEl = document.getElementById("add-pop");
    if (modalEl) {
      modalEl.classList.remove("show");
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.style.display = "none";
    }
  };

  // 🔹 Form submit handler
  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      firm_name: values.firmName,
      bank_name: values.bankName,
      account_name: values.accountName,
      account_number: values.accountNumber,
      month: values.month,
      year: values.year,
      account_open_date: values.accountOpenDate
        ? new Date(values.accountOpenDate).toLocaleDateString("en-CA")
        : null,
      account_close_date: values.accountCloseDate
        ? new Date(values.accountCloseDate).toLocaleDateString("en-CA")
        : null,
    };

    setLoadingUpdate(true);
    try {
      let resultAction;
      if (currentUser) {
        // 🔹 Update existing trust account
        resultAction = await dispatch(
          updateTrustAccount({
            clientId: currentUser.clientId,
            formData: payload,
          })
        );
      } else {
        // 🔹 Create new trust account
        resultAction = await dispatch(createTrustAccount(payload));
      }

      if (resultAction && resultAction.payload.success) {
        closemodal();
        dispatch(getAllClientTrustAccount());

        // 🔹 Reset form after successful submit
        resetForm({
          values: {
            firmName: "",
            bankName: "",
            accountName: "",
            accountNumber: "",
            month: 0,
            year: 0,
            accountOpenDate: "",
            accountCloseDate: "",
          },
        });
        setOpenDate(null);
        setCloseDate(null);
      }
    } catch (error) {
      console.error("Unexpected error", error);
    } finally {
      // 🔹 Always clear loading state
      setLoadingUpdate(false);
      document.body.classList.remove("modal-open");
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
    }
  };

  return (
    <div
      className="modal animate__animated animate__bounceIn my-popup fade"
      id="add-pop"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      ref={modalRef}
    >
      <div
        className="modal-dialog modal-dialog-edit"
        role="document"
        style={{ maxWidth: "900px" }}
      >
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
                <img src="images/cross-pop.svg" alt="Close" />
              </span>
            </button>
          </div>

          {/* 🔹 Modal Body */}
          <div className="modal-body">
            <div className="delete-pop-wrap">
              {!loadingData ? (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ setFieldValue, resetForm }) => (
                    <Form>
                      <div className="delete-pop-inner gap-1">
                        <h3>{currentUser ? "Update" : "Add"} Trust Account</h3>
                      </div>

                      <div
                        className="edit-pop-form mt-5 justify-content-start"
                        style={{ gap: "15px 16px" }}
                      >
                        {/* 🔹 Form Fields: Firm Name, Bank Name, Account Name, Account Number */}
                        <div className="edit-pop-in">
                          <label>Firm Name</label>
                          <Field
                            type="text"
                            name="firmName"
                            placeholder="Enter Firm Name"
                            className="edit-field"
                          />
                          <ErrorMessage name="firmName" component="div" className="error" />
                        </div>

                        <div className="edit-pop-in">
                          <label>Bank Name</label>
                          <Field
                            type="text"
                            name="bankName"
                            placeholder="Enter Bank Name"
                            className="edit-field"
                          />
                          <ErrorMessage name="bankName" component="div" className="error" />
                        </div>

                        <div className="edit-pop-in">
                          <label>Account Name</label>
                          <Field
                            type="text"
                            name="accountName"
                            placeholder="Enter Account Name"
                            className="edit-field"
                          />
                          <ErrorMessage name="accountName" component="div" className="error" />
                        </div>

                        <div className="edit-pop-in">
                          <label>Account Number</label>
                          <Field
                            type="text"
                            name="accountNumber"
                            placeholder="Enter Account Number"
                            className="edit-field"
                          />
                          <ErrorMessage
                            name="accountNumber"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* 🔹 Month & Year dropdowns (disabled for edit) */}
                        <div className="edit-pop-in">
                          <label>Month</label>
                          <Field
                            as="select"
                            name="month"
                            className="edit-field edit-select"
                            disabled={true}
                          >
                            <option value="0">Select Month</option>
                            {[
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                            ].map((month, index) => (
                              <option key={index + 1} value={index + 1}>
                                {month}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="month" component="div" className="error" />
                        </div>

                        <div className="edit-pop-in">
                          <label>Year</label>
                          <Field
                            as="select"
                            name="year"
                            className="edit-field edit-select"
                            disabled={true}
                          >
                            <option value="0">Select Year</option>
                            {Array.from({ length: 11 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              );
                            })}
                          </Field>
                          <ErrorMessage name="year" component="div" className="error" />
                        </div>

                        {/* 🔹 Account Open & Close Dates */}
                        <div className="edit-pop-in">
                          <label>Account Open Date</label>
                          <div className="bidder-field-in-item">
                            <DatePicker
                              selected={openDate}
                              onChange={(date) => {
                                setOpenDate(date);
                                setFieldValue("accountOpenDate", date);
                              }}
                              placeholderText="Select Open Date"
                              dateFormat="yyyy-MM-dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              disabled={!!currentUser}
                            />
                          </div>
                          <ErrorMessage
                            name="accountOpenDate"
                            component="div"
                            className="error"
                          />
                        </div>

                        <div className="edit-pop-in">
                          <label>Account Close Date</label>
                          <div className="bidder-field-in-item">
                            <DatePicker
                              selected={closeDate}
                              onChange={(date) => {
                                setCloseDate(date);
                                setFieldValue("accountCloseDate", date);
                              }}
                              placeholderText="Select Close Date"
                              dateFormat="yyyy-MM-dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                            />
                          </div>
                          <ErrorMessage
                            name="accountCloseDate"
                            component="div"
                            className="error"
                          />
                        </div>

                        {/* 🔹 Submit button */}
                        <div className="delete-pop-btn mt-4">
                          <button
                            type="submit"
                            className="influ-btn"
                            disabled={loadingUpdate}
                          >
                            {loadingUpdate ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div>Loading...</div> // 🔹 Loader until form is ready
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrustAccount;
