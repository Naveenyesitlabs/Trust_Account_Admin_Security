import { useFormik } from "formik"; // Form handling library
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { useNavigate } from "react-router-dom"; // Navigation
import * as Yup from "yup"; // Validation library
import AddJurnalEntry from "../component/AddJurnalEntry"; // Modal/component to add journal entry
import {
  getAllJournalEntry, // Redux action to fetch all journal entries
  getJournalEntry, // Redux action to fetch a single journal entry
} from "../redux/slices/adminSlice";

const JournalEntry = () => {
  const navigate = useNavigate(); // For programmatic navigation
  const dispatch = useDispatch(); // Redux dispatch

  // Local state
  const [allBank, setAllBank] = useState([]); // Store unique bank names for dropdown
  const { allJournalEntryBank } = useSelector((state) => state.admin); // Redux state: all journal entries

  // Fetch all journal entries on component mount
  useEffect(() => {
    dispatch(getAllJournalEntry());
  }, [dispatch]); // Dependency array ensures only runs once on mount

  // Extract unique bank names when allJournalEntryBank updates
  useEffect(() => {
    if (allJournalEntryBank.length > 0) {
      const bankNames = [
        ...new Set(allJournalEntryBank.map((bank) => bank.bank_name)),
      ];
      setAllBank(bankNames); // Update local state with unique bank names
    }
  }, [allJournalEntryBank]); // Only run when allJournalEntryBank changes

  // Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      bank_name: "", // Selected bank
      account_number: "", // Entered account number
      account_name: "", // Entered account name
    },
    validationSchema: Yup.object({
      bank_name: Yup.string().required("Bank name is required"), // Validation
      account_number: Yup.string()
        .matches(/^\d+$/, "Account number must be a number") // Must be numeric
        .required("Account number is required"),
      account_name: Yup.string().required("Account name is required"),
    }),
    onSubmit: async (values) => {
      // Dispatch getJournalEntry with form values
      const allData = await dispatch(getJournalEntry(formik.values));
      if (allData.payload.success) {
        // Navigate to get-journal page with query params if successful
        navigate(
          `/journal-entry/get-journal?bank_name=${values.bank_name}&account_number=${values.account_number}&account_name=${values.account_name}`
        );
      }
    },
  });

  return (
    <>
      <main className="journal-ledger-page">
        <div className="influ-in journal-ledger-wrap">
          <div className="journal-ledger-in">
            <h2>Journal Entry</h2>

            {/* Form to select bank and enter account info */}
            <form onSubmit={formik.handleSubmit}>
              <div className="edit-pop-form">
                <div className="edit-pop-in">
                  <label>Bank Name</label>
                  <select
                    name="bank_name"
                    className="edit-field edit-select"
                    {...formik.getFieldProps("bank_name")} // Bind Formik
                  >
                    <option value="">Select Bank</option>
                    {allBank.map(
                      (bank, index) =>
                        bank && (
                          <option key={index} value={bank}>
                            {bank}
                          </option>
                        )
                    )}
                  </select>
                  {/* Validation error */}
                  {formik.touched.bank_name && formik.errors.bank_name && (
                    <div className="error">{formik.errors.bank_name}</div>
                  )}
                </div>

                <div className="edit-pop-in">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="account_number"
                    placeholder="Enter Account Number"
                    className="edit-field"
                    {...formik.getFieldProps("account_number")}
                  />
                  {formik.touched.account_number &&
                    formik.errors.account_number && (
                      <div className="error">
                        {formik.errors.account_number}
                      </div>
                    )}
                </div>

                <div className="edit-pop-in">
                  <label>Account Name</label>
                  <input
                    type="text"
                    name="account_name"
                    placeholder="Enter Account Name"
                    className="edit-field"
                    {...formik.getFieldProps("account_name")}
                  />
                  {formik.touched.account_name &&
                    formik.errors.account_name && (
                      <div className="error">{formik.errors.account_name}</div>
                    )}
                </div>

                {/* Submit button */}
                <div className="delete-pop-btn">
                  <button
                    className="primary-btn-cstm"
                    type="submit"
                    style={
                      formik.values.account_name &&
                        formik.values.account_number &&
                        formik.values.bank_name
                        ? { backgroundColor: "#030f23" } // Enable button visually if all fields filled
                        : {}
                    }
                  >
                    Get Journal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Component/modal to add journal entry */}
      <AddJurnalEntry />
    </>
  );
};

export default JournalEntry;
