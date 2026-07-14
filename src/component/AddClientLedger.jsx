import { useFormik } from "formik";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { addLedgerEntry, getAllCases, updateLedgerData } from "../redux/slices/adminSlice";

// AddClientLedger component handles adding/editing client ledger entries
// Props: editedData (existing data for edit mode), status ("add" or "edit"), client info, callbacks, etc.
const AddClientLedger = ({
  editedData = null,
  status = "add",
  client,
  onSuccess,
  client_id,
  case_id,
  ledger_client_name,
}) => {
  const dispatch = useDispatch();
  const { cases } = useSelector((state) => state.admin);
  // Track selected client in state
  const [selectedClient, setSelectedClient] = useState(client?.clientId || client_id);
  const [selectedCaseId, setSelectedCaseId] = useState(case_id);
  const [caseDropdown, setCaseDropdown] = useState([]);

  useEffect(() => {
    dispatch(getAllCases());
  }, [dispatch]);

  useEffect(() => {
    if (cases) {
      setCaseDropdown(cases);
    }
  }, [cases]);

  // Sync selectedClient with prop on mount
  useEffect(() => {
    setSelectedClient(client_id);
  }, []);

  // Formik form setup
  const formik = useFormik({
    initialValues: {
      client_id: selectedClient,
      case_id: selectedCaseId,
      date: "",
      payee_name: "",
      transaction_method: "",
      cheque_number: "",
      purpose: "",
      transaction_type: "",
      amount: "",
      client_name: "",
      notes: "",
      reconcile_to_journal: "",
    },
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
      amount: Yup.number()
        .typeError("Must be a number")
        .required("Amount is required"),
      client_name: Yup.string().required("Client name is required"),
      notes: Yup.string().nullable(),
      reconcile_to_journal: Yup.string().nullable().notRequired(),
    }),
    // Form submit handler
    onSubmit: async (values) => {
      if (status === "add") {
        // Add new ledger entry
        const res = await dispatch(addLedgerEntry(values));
        if (res?.payload?.success) {
          // Reset form and close modal on success
          formik.resetForm({
            values: { ...formik.initialValues, client_id: selectedClient },
          });
          closeModal();
          onSuccess?.();
        }
      } else {
        // Update existing ledger entry
        const res = await dispatch(
          updateLedgerData({ id: editedData.id, formData: values })
        );
        if (res?.payload?.success) {
          // Reset form and close modal on success
          formik.resetForm({
            values: { ...formik.initialValues, client_id: selectedClient },
          });
          closeModal();
          onSuccess?.();
        }
      }
    },
    enableReinitialize: true, // reinitialize form values when props change
  });

  // Helper function to manually close Bootstrap modal
  const closeModal = () => {
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

  // Prefill form values in edit mode
  useEffect(() => {
    if (status === "edit" && editedData) {
      // Map editedData into form values
      const ledgerData = {
        date: editedData.date,
        payee_name: editedData.payee_name,
        transaction_method: editedData.transaction_method,
        cheque_number: editedData.cheque_number,
        purpose: editedData.purpose,
        transaction_type:
          parseFloat(editedData.deposit_amount) !== 0 ? "deposit" : "disbursement",
        amount:
          parseFloat(editedData.deposit_amount) !== 0
            ? editedData.deposit_amount
            : editedData.disbursement_amount,
        client_name: editedData.client_name,
        notes: editedData.notes,
        reconcile_to_journal: editedData.reconcile_to_journal ? "true" : "false",
      };

      // Set form values with edited data
      formik.setValues({ ...formik.initialValues, ...ledgerData });
    } else {
      // Reset form in add mode
      formik.resetForm({
        values: { ...formik.initialValues, client_id: selectedClient },
      });
    }
  }, [editedData]);

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
          {/* Modal heading with close button */}
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">
                <img src="/images/cross-pop.svg" alt="Close modal" />
              </span>
            </button>
          </div>

          {/* Modal body with form */}
          <div className="modal-body">
            <div className="delete-pop-wrap">
              <form onSubmit={formik.handleSubmit}>
                {/* Hidden input for client_id */}
                <input
                  type="hidden"
                  name="client_id"
                  value={formik.values[client?.clientId]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />

                <div className="delete-pop-inner gap-1">
                  {/* Modal title */}
                  <h3>{status === "edit" ? "Edit" : "Entry Detail"}</h3>
                </div>

                <div
                  className="edit-pop-form mt-5 justify-content-start"
                  style={{ gap: "15px 16px" }}
                >
                  {/* Transaction Date with DatePicker */}
                  <div className="edit-pop-in">
                    <label>Transaction Date</label>
                    <div className="bidder-field-in-item">
                      <DatePicker
                        selected={
                          formik.values.date
                            ? new Date(formik.values.date)
                            : null
                        }
                        onChange={(date) =>
                          formik.setFieldValue(
                            "date",
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
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

                  {/* Payee Name */}
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

                  {/* Transaction Method */}
                  <div className="edit-pop-in">
                    <label>Transaction Method</label>
                    <select
                      className="edit-field edit-select"
                      name="transaction_method"
                      value={formik.values.transaction_method}
                      {...formik.getFieldProps("transaction_method")}
                    >
                      <option value="">Select</option>
                      <option value="Cheque">Check Number</option>
                      <option value="Electronic Transfer">
                        Electronic Transfer
                      </option>
                    </select>
                    {formik.touched.transaction_method &&
                      formik.errors.transaction_method && (
                        <div className="error">{formik.errors.transaction_method}</div>
                      )}
                  </div>

                  {/* Cheque Number / Electronic Transfer ID */}
                  <div className="edit-pop-in">
                    <label>Check Number / Electronic Transfer ID </label>
                    <input
                      type="text"
                      placeholder="Enter Cheque Number"
                      name="cheque_number"
                      className="edit-field"
                      value={formik.values.cheque_number}
                      {...formik.getFieldProps("cheque_number")}
                    />
                    {formik.touched.cheque_number &&
                      formik.errors.cheque_number && (
                        <div className="error">{formik.errors.cheque_number}</div>
                      )}
                  </div>

                  {/* Purpose */}
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

                  {/* Transaction Type */}
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
                    {formik.touched.transaction_type &&
                      formik.errors.transaction_type && (
                        <div className="error">{formik.errors.transaction_type}</div>
                      )}
                  </div>

                  {/* Amount */}
                  <div className="edit-pop-in">
                    <label>Amount</label>
                    <input
                      type="text"
                      placeholder="Enter Amount"
                      name="notes"
                      className="edit-field"
                      value={formik.values.amount}
                      {...formik.getFieldProps("amount")}
                    />
                    {formik.touched.amount && formik.errors.amount && (
                      <div className="error">{formik.errors.amount}</div>
                    )}
                  </div>

                  {/* Client Name (read-only) */}
                  <div className="edit-pop-in">
                    <label>Client Name</label>
                    <input
                      type="text"
                      placeholder="Enter Client Name"
                      name="notes"
                      className="edit-field"
                      value={formik.values.client_name}
                      {...formik.getFieldProps("client_name")}
                    // disabled={true}
                    />
                    {formik.touched.client_name &&
                      formik.errors.client_name && (
                        <div className="error">{formik.errors.client_name}</div>
                      )}
                  </div>

                  <div className="edit-pop-in">
                    <label>Case</label>
                    <select
                      className="edit-field edit-select"
                      name="case_id"
                      value={formik.values.case_id}
                      {...formik.getFieldProps("case_id")}
                      disabled={true}
                    >
                      <option value="">Select Case</option>
                      {caseDropdown && caseDropdown.map((caseItem) => (
                        <option key={caseItem.id} value={caseItem.id}>
                          {caseItem.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.case_id && formik.errors.case_id && (
                      <div className="error">{formik.errors.case_id}</div>
                    )}
                  </div>

                  {/* Notes */}
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

                  {/* Reconciled to Journal dropdown - only in edit mode */}
                  {editedData && (
                    <div className="edit-pop-in">
                      <label>Reconciled to Journal</label>
                      <select
                        className="edit-field edit-select"
                        name="reconcile_to_journal"
                        value={formik.values.reconcile_to_journal}
                        onChange={formik.handleChange}
                      >
                        <option value="">Select</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  )}

                  {/* Submit button */}
                  <div className="delete-pop-btn mt-4">
                    <button type="submit" className="influ-btn">
                      {status === "edit" ? "Update" : "Add Entry"}
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

export default AddClientLedger;
