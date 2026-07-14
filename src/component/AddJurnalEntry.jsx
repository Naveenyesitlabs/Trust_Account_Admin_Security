import { useFormik } from "formik";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  addJournalEntry,
  getAllCases,
  getAllClientAccounts,
  getJournalEntry,
  updateJournalEntry,
} from "../redux/slices/adminSlice";

const AddJurnalEntry = ({ editData = null, status = "add", client }) => {
  const dispatch = useDispatch();
  const { cases } = useSelector((state) => state.admin);

  // 🔹 Track currently selected client
  const [selectedClient, setSelectedClient] = useState(client?.clientId);
  const [caseDropdownOpen, setCaseDropdownOpen] = useState([]);

  // 🔹 Load all client accounts on mount
  useEffect(() => {
    dispatch(getAllClientAccounts());
    dispatch(getAllCases());
  }, [dispatch]);

  useEffect(() => {
    if (cases) {
      setCaseDropdownOpen(cases);
    }
  }, [cases]);

  // 🔹 Sync selectedClient state when client prop changes
  useEffect(() => {
    setSelectedClient(client?.clientId);
  }, [client]);

  // 🔹 Formik setup
  const formik = useFormik({
    initialValues: {
      client_id: selectedClient,
      date: "",
      payee_name: "",
      transaction_method: "",
      cheque_number: "",
      purpose: "",
      transaction_type: "",
      amount: "",
      client_name: "",
      notes: "",
      reconciled_to_ledger: "",
      reconciled_to_bank_statement: "",
      case_id: "",
    },
    // 🔹 Yup validation schema
    validationSchema: Yup.object({
      date: Yup.string().required("Transaction date is required"),
      payee_name: Yup.string().required("Payee or Payor name is required"),
      transaction_method: Yup.string().required("Transaction method is required"),
      cheque_number: Yup.string().matches(
        /^[a-zA-Z0-9]+$/,
        "Only alphanumeric characters are allowed"
      ),
      purpose: Yup.string().required("Purpose is required"),
      transaction_type: Yup.string().required("Transaction type is required"),
      amount: Yup.number().typeError("Must be a number").required("Amount is required"),
      client_name: Yup.string().required("Client name is required"),
      notes: Yup.string().nullable(),
      reconciled_to_ledger: Yup.string().nullable(),
      reconciled_to_bank_statement: Yup.string().nullable(),
      case_id: Yup.string().required("Case is required"),
    }),
    // 🔹 Form submit handler
    onSubmit: async (values) => {
      if (status === "add") {
        const res = await dispatch(addJournalEntry(values));
        if (res?.payload?.success) {
          formik.resetForm({ values: { ...formik.initialValues, client_id: selectedClient } });
          closemodal();
        }
      } else {
        const res = await dispatch(updateJournalEntry({ id: editData.id, formData: values }));
        if (res?.payload?.success) {
          formik.resetForm({ values: { ...formik.initialValues, client_id: selectedClient } });
          closemodal();
        }
      }

      // 🔹 Refresh journal entries table after add/update
      await dispatch(
        getJournalEntry({
          bank_name: client.bank_name,
          account_number: client.account_number,
          account_name: client.account_name,
        })
      );
    },
    enableReinitialize: true, // 🔹 Allows form to update values if editData changes
  });

  // 🔹 Prefill form values in edit mode
  useEffect(() => {
    if (status === "edit" && editData) {
      const journalData = {
        date: editData.date,
        payee_name: editData.payee_name,
        transaction_method: editData.transaction_method,
        cheque_number: editData.cheque_number,
        purpose: editData.purpose,
        transaction_type:
          parseFloat(editData.deposit_amount) !== 0 ? "deposit" : "disbursement",
        amount:
          parseFloat(editData.deposit_amount) !== 0
            ? editData.deposit_amount
            : editData.disbursement_amount,
        client_name: editData.client_name,
        notes: editData.notes,
        reconciled_to_ledger: editData.reconciled_to_ledger ? "true" : "false",
        reconciled_to_bank_statement: editData.reconciled_to_bank_statement ? "true" : "false",
        case_id: editData.case_id || "",
      };

      formik.setValues({ ...formik.initialValues, ...journalData });
    } else {
      formik.resetForm({ values: { ...formik.initialValues, client_id: selectedClient } });
    }
  }, [editData]);

  // 🔹 Close modal manually (Bootstrap cleanup)
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

  return (
    <div
      className="modal animate__animated animate__bounceIn my-popup"
      id="add-pop"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div
        className="modal-dialog modal-dialog-edit"
        role="document"
        style={{ minWidth: "70%", transform: "scale(0.85)" }}
      >
        <div className="modal-content clearfix">
          {/* 🔹 Modal header */}
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">
                <img src="/images/cross-pop.svg" alt="Close" />
              </span>
            </button>
          </div>

          {/* 🔹 Modal body */}
          <div className="modal-body">
            <div className="delete-pop-wrap">
              <form onSubmit={formik.handleSubmit}>
                {/* 🔹 Hidden client_id field */}
                <input
                  type="hidden"
                  name="client_id"
                  value={formik.values.client_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="delete-pop-inner gap-1">
                  <h3>{status === "edit" ? "Edit" : "Entry Detail"}</h3>
                </div>

                <div
                  className="edit-pop-form mt-5 justify-content-start"
                  style={{ gap: "15px 16px" }}
                >
                  {/* 🔹 Transaction Date with DatePicker */}
                  <div className="edit-pop-in">
                    <label>Transaction Date</label>
                    <div className="bidder-field-in-item">
                      <DatePicker
                        selected={formik.values.date ? new Date(formik.values.date) : null}
                        onChange={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const day = String(date.getDate()).padStart(2, "0");
                            formik.setFieldValue("date", `${year}-${month}-${day}`);
                          } else {
                            formik.setFieldValue("date", "");
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select open date"
                        className="edit-field"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                    {formik.touched.date && formik.errors.date && (
                      <div className="error">{formik.errors.date}</div>
                    )}
                  </div>

                  {/* 🔹 Payee Name */}
                  <div className="edit-pop-in">
                    <label>Payee Name</label>
                    <input
                      type="text"
                      placeholder="Enter Payee Name"
                      name="payee_name"
                      className="edit-field"
                      value={formik.values.payee_name}
                      {...formik.getFieldProps("payee_name")}
                    />
                    {formik.touched.payee_name && formik.errors.payee_name && (
                      <div className="error">{formik.errors.payee_name}</div>
                    )}
                  </div>

                  {/* 🔹 Transaction Method */}
                  <div className="edit-pop-in">
                    <label>Transaction Method</label>
                    <select
                      className="edit-field edit-select"
                      name="transaction_method"
                      value={formik.values.transaction_method}
                      {...formik.getFieldProps("transaction_method")}
                    >
                      <option value="">Select</option>
                      <option value="Check">Check Number</option>
                      <option value="Electronic Transfer">Electronic Transfer</option>
                    </select>
                    {formik.touched.transaction_method && formik.errors.transaction_method && (
                      <div className="error">{formik.errors.transaction_method}</div>
                    )}
                  </div>

                  {/* 🔹 Cheque / Transfer ID */}
                  <div className="edit-pop-in">
                    <label>Check Number / Electronic Transfer ID</label>
                    <input
                      type="text"
                      placeholder="Enter Check Number"
                      name="cheque_number"
                      className="edit-field"
                      value={formik.values.cheque_number}
                      {...formik.getFieldProps("cheque_number")}
                    />
                    {formik.touched.cheque_number && formik.errors.cheque_number && (
                      <div className="error">{formik.errors.cheque_number}</div>
                    )}
                  </div>

                  {/* 🔹 Purpose */}
                  <div className="edit-pop-in">
                    <label>Purpose</label>
                    <input
                      type="text"
                      placeholder="Enter Purpose"
                      name="purpose"
                      className="edit-field"
                      value={formik.values.purpose}
                      {...formik.getFieldProps("purpose")}
                    />
                    {formik.touched.purpose && formik.errors.purpose && (
                      <div className="error">{formik.errors.purpose}</div>
                    )}
                  </div>

                  {/* 🔹 Transaction Type */}
                  <div className="edit-pop-in">
                    <label>Transaction Type</label>
                    <select
                      className="edit-field edit-select"
                      name="transaction_type"
                      value={formik.values.transaction_type}
                      {...formik.getFieldProps("transaction_type")}
                    >
                      <option value="">Select</option>
                      <option value="deposit">Deposit</option>
                      <option value="disbursement">Disbursement</option>
                    </select>
                    {formik.touched.transaction_type && formik.errors.transaction_type && (
                      <div className="error">{formik.errors.transaction_type}</div>
                    )}
                  </div>

                  {/* 🔹 Amount */}
                  <div className="edit-pop-in">
                    <label>Amount</label>
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      name="amount"
                      className="edit-field"
                      value={formik.values.amount}
                      {...formik.getFieldProps("amount")}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className="error">{formik.errors.amount}</div>
                    )}
                  </div>

                  <div className="edit-pop-in">
                    <label>Case</label>
                    <select
                      className="edit-field edit-select"
                      name="case_id"
                      value={formik.values.case_id}
                      {...formik.getFieldProps("case_id")}
                    >
                      <option value="">Select Case</option>
                      {caseDropdownOpen && caseDropdownOpen.map((caseItem) => (
                        <option key={caseItem.id} value={caseItem.id}>
                          {caseItem.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.case_id && formik.errors.case_id && (
                      <div className="error">{formik.errors.case_id}</div>
                    )}
                  </div>

                  {/* 🔹 Client Name */}
                  <div className="edit-pop-in">
                    <label>Client Name</label>
                    <input
                      type="text"
                      placeholder="Enter Client Name"
                      name="client_name"
                      className="edit-field"
                      value={formik.values.client_name}
                      {...formik.getFieldProps("client_name")}
                    />
                    {formik.touched.client_name && formik.errors.client_name && (
                      <div className="error">{formik.errors.client_name}</div>
                    )}
                  </div>

                  {/* 🔹 Notes */}
                  <div className="edit-pop-in">
                    <label>Notes</label>
                    <input
                      type="text"
                      placeholder="Enter Notes"
                      name="notes"
                      className="edit-field"
                      value={formik.values.notes}
                      {...formik.getFieldProps("notes")}
                    />
                    {formik.touched.notes && formik.errors.notes && (
                      <div className="error">{formik.errors.notes}</div>
                    )}
                  </div>

                  {/* 🔹 Reconciliation fields in edit mode */}
                  {editData && (
                    <>
                      <div className="edit-pop-in">
                        <label>Reconciled to Ledger</label>
                        <select
                          className="edit-field edit-select"
                          name="reconciled_to_ledger"
                          value={formik.values.reconciled_to_ledger}
                          onChange={formik.handleChange}
                          {...formik.getFieldProps("reconciled_to_ledger")}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>

                      <div className="edit-pop-in">
                        <label>Reconciled to Bank Statement?</label>
                        <select
                          className="edit-field edit-select"
                          name="reconciled_to_bank_statement"
                          value={formik.values.reconciled_to_bank_statement}
                          onChange={formik.handleChange}
                          {...formik.getFieldProps("reconciled_to_bank_statement")}
                        >
                          <option value="">Select</option>
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* 🔹 Submit Button */}
                  <div className="delete-pop-btn mt-4">
                    <button type="submit" className="influ-btn">
                      {status === "edit" ? "Update Journal Entry" : "Add Journal Entry"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJurnalEntry;
