import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  getAllClientAccounts,
  getAllClientLedger,
  getAllFirmList,
  getClientLedger,
  getClientListByFirm,
} from "../redux/slices/adminSlice";

/**
 * Component for viewing and fetching client ledger details
 */
const ClientLedger = () => {

  const navigate = useNavigate(); // React Router navigation
  const { firms, clientsByFirm } = useSelector((state) => state.admin); // Redux state
  const [firmData, setFirmData] = useState([]); // List of all firms
  const [clientList, setClientList] = useState([]); // List of clients by selected firm
  const dispatch = useDispatch(); // Redux dispatch
  const [accountId, setAccountId] = useState([]); // Account ID of selected client

  /**
   * Formik setup for form handling and validation
   */
  const formik = useFormik({
    initialValues: {
      firm_name: "",
      case_id: "",
      purpose: "",
    },
    validationSchema: Yup.object({
      firm_name: Yup.string().required("Please select a firm"),
      case_id: Yup.string().required("Please select a ledger detail"),
      purpose: Yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      const trust_account_id = accountId;
      // Dispatch action to fetch client ledger
      const data = await dispatch(getClientLedger({ ...values, account_id: trust_account_id }));
      if (data.payload.success) {
        // Navigate to ledger page with query params
        navigate(`/client-ledger/get-ledger?trust_account_id=${trust_account_id}&purpose=${values.purpose}&firm_name=${values.firm_name}&case_id=${values.case_id}`);
        // Save ledger info in localStorage for persistence
        localStorage.setItem("ledgerData", JSON.stringify({
          case_id: values.case_id,
          purpose: values.purpose,
          firm_name: values.firm_name,
          trust_account_id: trust_account_id
        }));
      } else {
        toast.error(data.payload.message); // show error if failed
      }
    },
  });

  /**
   * Fetch all initial data on mount
   */
  useEffect(() => {
    dispatch(getAllClientLedger()); // Fetch all client ledger
    dispatch(getAllClientAccounts()); // Fetch all client accounts
    dispatch(getAllFirmList()); // Fetch all firms
  }, [dispatch]);

  /**
   * Fetch client list when a firm is selected
   */
  const handleFirmChange = async (selected_firm_name) => {
    const res = await dispatch(getClientListByFirm({ firm_name: selected_firm_name }));
    if (res.payload.success) {
      setClientList(res.payload.data); // update local client list
      setAccountId(res.payload.data[0]?.trust_account_id); // default account_id for first client
    }
  };

  /**
   * Update clientList whenever clientsByFirm Redux state changes
   */
  useEffect(() => {
    if (clientsByFirm) {
      setClientList(clientsByFirm);
    }
  }, [clientsByFirm]);

  /**
   * Update firmData whenever firms Redux state changes
   */
  useEffect(() => {
    if (firms && firms.length > 0) {
      setFirmData(firms);
    }
  }, [firms]);

  return (
    <main className="journal-ledger-page">
      <div className="influ-in journal-ledger-wrap">
        <div className="journal-ledger-in">
          <h2>Client Ledger</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="edit-pop-form">
              <div className="edit-pop-in">
                {/* Firm Name Select */}
                <label>Firm Name</label>
                <select
                  className="edit-field edit-select"
                  name="firm_name"
                  value={formik.values.firm_name}
                  onChange={async (e) => {
                    const selectedFirm = e.target.value;
                    formik.setTouched({ ...formik.touched, firm_name: true }); // mark as touched
                    formik.setFieldValue("firm_name", selectedFirm);  // update Formik state
                    await handleFirmChange(selectedFirm);             // fetch clients for selected firm
                  }}
                >
                  <option value="">Select Firm</option>
                  {firmData?.map((firm, index) => (
                    <option key={index} value={firm.firm_name}>
                      {firm.firm_name}
                    </option>
                  ))}
                </select>

                {/* Firm Name validation error */}
                {formik.touched.firm_name && formik.errors.firm_name && (
                  <div className="error">{formik.errors.firm_name}</div>
                )}
              </div>

              <div className="edit-pop-in">
                {/* Client Ledger Select */}
                <label>Ledgers Detail</label>
                <select
                  className="edit-field edit-select"
                  name="client_id"
                  value={formik.values.case_id}
                  onChange={async (e) => {
                    const case_id = e.target.value;
                    const selectedOption = e.target.options[e.target.selectedIndex];
                    // const client_name = selectedOption.getAttribute('data-client');
                    const trust_account_id = selectedOption.getAttribute('data-account');

                    await formik.setFieldValue("case_id", case_id); // update Formik state
                    formik.setTouched({ ...formik.touched, case_id: true }); // mark as touched

                    // Store additional client info in Formik
                    // await formik.setFieldValue("client_name", client_name);
                    await formik.setFieldValue("account_id", trust_account_id);
                  }}
                >
                  <option value="">Select Ledger Detail</option>
                  {clientList?.map((client, index) => (
                    <option key={index} value={client.case_id} data-account={client.trust_account_id}>
                      {client.case_name}
                    </option>
                  ))}
                </select>

                {/* Client ID validation error */}
                {formik.touched.case_id &&
                  formik.errors.case_id && (
                    <div className="error">{formik.errors.case_id}</div>
                  )}
              </div>

              <div className="edit-pop-in">
                {/* Purpose Input */}
                <label>Purpose</label>
                <input
                  type="text"
                  name="purpose"
                  value={formik.values.purpose}
                  {...formik.getFieldProps("purpose")}
                  placeholder="Enter purpose"
                  className="edit-field"
                />
                {/* Purpose validation error */}
                {formik.touched.purpose && formik.errors.purpose && (
                  <div className="error">{formik.errors.purpose}</div>
                )}
              </div>

              {/* Submit button */}
              <div className="delete-pop-btn">
                <button
                  className="influ-btn"
                  type="submit"
                  style={
                    formik.values.client_id ? { backgroundColor: "#030f23" } : {}
                  }
                >
                  Get Ledger
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ClientLedger;
