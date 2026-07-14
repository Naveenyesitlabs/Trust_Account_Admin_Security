import { Modal } from "bootstrap";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { addNewCase } from "../redux/Api";
import {
  getAllCases,
  getAllClientAccounts
} from "../redux/slices/adminSlice";

const AddCaseModal = ({ editData = null, status = "add", client }) => {
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
      case_date: "",
      close_date: "",
      description: "",
      name: "",
      notes: "",
      open_date: "",
    },
    // 🔹 Yup validation schema
    validationSchema: Yup.object({
      case_date: Yup.string().nullable(),
      close_date: Yup.string().nullable(),
      description: Yup.string().nullable(),
      name: Yup.string().required("Case name is required"),
      notes: Yup.string().nullable(),
      open_date: Yup.string().required("Open date is required"),
    }),
    // 🔹 Form submit handler
    onSubmit: async (values) => {
      try {
        console.log("Form Values:", values);

        // submitting the for to save new case
        // await dispatch(addNewCase(values));
        await addNewCase(values);
        formik.resetForm();
        await dispatch(getAllCases());
        // Close the modal after submission
        closemodal();
      } catch (error) {
        console.log(error);
      }
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
  // const closemodal = () => {
  //   document.body.classList.remove("modal-open");
  //   const backdrops = document.querySelectorAll(".modal-backdrop");
  //   backdrops.forEach((backdrop) => backdrop.remove());

  //   const modalEl = document.getElementById("add-pop");
  //   if (modalEl) {
  //     modalEl.classList.remove("show");
  //     modalEl.setAttribute("aria-hidden", "true");
  //     modalEl.style.display = "none";
  //   }
  // };

  const closemodal = () => {

    const modalIds = ["add-case-pop", "add-pop"];

    modalIds.forEach((id) => {

      const modalEl = document.getElementById(id);

      if (modalEl) {

        // Bootstrap hide
        const modalInstance =
          Modal.getInstance(modalEl) || new Modal(modalEl);

        modalInstance.hide();

        // Extra cleanup
        modalEl.classList.remove("show");
        modalEl.style.display = "none";
        modalEl.setAttribute("aria-hidden", "true");
        modalEl.removeAttribute("aria-modal");
      }
    });

    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    document
      .querySelectorAll(".modal-backdrop")
      .forEach((el) => el.remove());
  };

  return (
    <div
      className="modal animate__animated animate__bounceIn my-popup"
      id="add-case-pop"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div
        className="modal-dialog modal-dialog-edit case-modal-width"
        role="document"
        style={{ transform: "scale(0.85)" }}
      >
        <div className="modal-content clearfix">

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

          <div className="modal-body">
            <div className="delete-pop-wrap">
              <form onSubmit={formik.handleSubmit}>

                <div className="delete-pop-inner gap-1">
                  <h3>Add Case</h3>
                </div>

                <div className="case-modal-form-layout mt-5">

                  {/* Case Name */}
                  <div className="case-modal-field-wrap">
                    <label>Case Name</label>
                    <input
                      type="text"
                      placeholder="Enter Case Name"
                      name="name"
                      className="edit-field"
                      value={formik.values.name}
                      {...formik.getFieldProps("name")}
                    />

                    {formik.touched.name && formik.errors.name && (
                      <div className="error">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>

                  {/* Open Date */}
                  <div className="case-modal-field-wrap">
                    <label>Open Date</label>

                    <div className="bidder-field-in-item">
                      <DatePicker
                        selected={
                          formik.values.open_date
                            ? new Date(formik.values.open_date)
                            : null
                        }
                        onChange={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(
                              date.getMonth() + 1
                            ).padStart(2, "0");
                            const day = String(
                              date.getDate()
                            ).padStart(2, "0");

                            formik.setFieldValue(
                              "open_date",
                              `${year}-${month}-${day}`
                            );
                          } else {
                            formik.setFieldValue("open_date", "");
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

                    {formik.touched.open_date && formik.errors.open_date && (
                      <div className="error">
                        {formik.errors.open_date}
                      </div>
                    )}
                  </div>

                  {/* Close Date */}
                  <div className="case-modal-field-wrap">
                    <label>Close Date</label>

                    <div className="bidder-field-in-item">
                      <DatePicker
                        disabled={true}
                        selected={
                          formik.values.close_date
                            ? new Date(formik.values.close_date)
                            : null
                        }
                        onChange={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(
                              date.getMonth() + 1
                            ).padStart(2, "0");
                            const day = String(
                              date.getDate()
                            ).padStart(2, "0");

                            formik.setFieldValue(
                              "close_date",
                              `${year}-${month}-${day}`
                            );
                          } else {
                            formik.setFieldValue("close_date", "");
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select close date"
                        className="edit-field"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="case-modal-field-wrap">
                    <label>Description</label>
                    <textarea
                      placeholder="Enter Description"
                      {...formik.getFieldProps("description")}
                      className="edit-field"
                      rows="4"
                    />
                  </div>

                  {/* Notes */}
                  <div className="case-modal-field-wrap">
                    <label>Notes</label>

                    <input
                      type="text"
                      placeholder="Enter Notes"
                      name="notes"
                      className="edit-field"
                      value={formik.values.notes}
                      {...formik.getFieldProps("notes")}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="delete-pop-btn mt-4">
                    <button type="submit" className="influ-btn">
                      Add Case
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

export default AddCaseModal;
