import { useEffect, useMemo, useState } from "react";
import CsvDownloader from "react-csv-downloader";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddClientLedger from "../component/AddClientLedger"; // Modal component to add/edit ledger
import DeletePopup from "../component/DeletePopup"; // Modal component to confirm deletion
import DesignerDateRangePicker from "../component/DesignerDateRangePicker"; // Custom date range filter
import Pagination from "../component/Pagination"; // Pagination component
import { useDateRangeFilter } from "../hooks/useDateRangeFilter"; // Hook to filter by date range
import useSortableData from "../hooks/useSortableData"; // Hook to enable table sorting
import { deleteLedgerEntry, getCaseInfoById, getClientInfoById, getClientLedger } from "../redux/slices/adminSlice"; // Redux actions
import { displayAccountNumber } from "../utils/helper"; // Helper to format account numbers

const GetLedger = () => {
  // Local state
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [selectedItem, setSelectedItem] = useState(null); // Selected ledger for edit
  const [currentPage, setCurrentPage] = useState(1); // Pagination current page
  const { allClientLedger, clientsForLedgers, caseInfo } = useSelector((state) => state.admin); // Redux state for ledger and client info
  const [data, setData] = useState([]); // Ledger data array
  const [clientInfo, setClientInfo] = useState([]); // Info about the client
  const [caseData, setCaseData] = useState([]); // Info about the client
  const [filteredData, setFilteredData] = useState([]); // Filtered ledger data
  const [deletedId, setDeletedId] = useState(""); // Ledger to delete
  const [status, setstatus] = useState(""); // Modal status ("add" or "edit")
  const dispatch = useDispatch();
  const [perPage, setPerPage] = useState(50); // Rows per page

  // URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  let query_case_id = urlParams.get('case_id');
  // let query_client_name = urlParams.get('client_name');
  let query_purpose = urlParams.get('purpose');
  let query_firm_name = urlParams.get('firm_name');
  let query_trust_account_id = urlParams.get('trust_account_id');

  // Override URL params with localStorage if exists
  const ledgerQueryData = localStorage.getItem("ledgerData");
  query_case_id = ledgerQueryData ? JSON.parse(ledgerQueryData).case_id : query_case_id;

  // query_client_name = ledgerQueryData ? JSON.parse(ledgerQueryData).client_name : query_client_name;
  query_purpose = ledgerQueryData ? JSON.parse(ledgerQueryData).purpose : query_purpose;
  query_firm_name = ledgerQueryData ? JSON.parse(ledgerQueryData).firm_name : query_firm_name;
  query_trust_account_id = ledgerQueryData ? JSON.parse(ledgerQueryData).trust_account_id : query_trust_account_id;

  // Fetch client info on mount
  useEffect(() => {
    console.log("Fetching client info for ID:", query_trust_account_id);
    dispatch(getClientInfoById({ client_id: query_trust_account_id }));
  }, []);

  // Fetch client ledger whenever relevant query params change
  useEffect(() => {
    dispatch(
      getClientLedger({
        firm_name: query_firm_name,
        case_id: query_case_id,
        purpose: query_purpose,
        account_id: query_trust_account_id
      })
    );
  }, [query_firm_name, query_case_id, query_purpose, query_trust_account_id]);

  // Set ledger data and client info when allClientLedger updates
  useEffect(() => {
    if (!allClientLedger || !allClientLedger.ledgers) return;

    // Update ledger data
    setData(allClientLedger.ledgers);

    // Update client info if exists
    if (allClientLedger.client) {
      const updatedInfo = {
        ...allClientLedger.client,
        account_open_date: allClientLedger.client.account_open_date
          ? new Date(allClientLedger.client.account_open_date).toLocaleDateString('en-CA')
          : null,
        account_close_date: allClientLedger.client.account_close_date
          ? new Date(allClientLedger.client.account_close_date).toLocaleDateString('en-CA')
          : null,
      };
      setClientInfo(updatedInfo);
    }

    dispatch(getCaseInfoById({ case_id: query_case_id }));
  }, [allClientLedger]);


  useEffect(() => {
    if (caseInfo) {
      setCaseData(caseInfo);
    }
  }, [caseInfo]);

  // Filter ledger data based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const filtered = data?.filter(
        (item) =>
          item?.payee_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.cheque_number?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.purpose?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.notes?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.client_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Sorting
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
  const getSortArrow = (key) =>
    sortConfig?.key === key
      ? sortConfig?.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const perPageOptions = [50, 100]; // Rows per page options

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedData?.slice(start, start + perPage);
  }, [sortedData, currentPage, perPage]);

  const totalPages = Math.ceil(sortedData?.length / perPage);

  // Delete a ledger entry
  const handleDelete = async (data) => {
    await dispatch(deleteLedgerEntry(data.id));

    // Refresh ledger data after deletion
    dispatch(getClientLedger({
      firm_name: query_firm_name,
      case_id: query_case_id,
      purpose: query_purpose,
      account_id: query_trust_account_id
    }));
  };

  // Date range filter
  const { handleApply, handleCancel } = useDateRangeFilter({
    data: data,
    dateKey: 'date',
    onFilter: setFilteredData,
  });

  // CSV export keys and header mapping
  const requiredKeys = [
    'serial_no', 'date', 'payee_name', 'transaction_method', 'cheque_number',
    'purpose', 'deposit_amount', 'disbursement_amount', 'case_ledger_balance',
    'notes', 'client_name', 'reconcile_to_journal'
  ];

  const headerMap = {
    serial_no: "Serial no",
    date: "Date",
    payee_name: "Payee Name",
    transaction_method: "Transaction Method",
    cheque_number: "Check Number",
    purpose: "Purpose",
    deposit_amount: "Deposit Amount",
    disbursement_amount: "Disbursement Amount",
    case_ledger_balance: "Running Balance",
    notes: "Notes",
    client_name: "Client Name",
    reconcile_to_journal: "Reconciled to Journal",
  };

  // Format data for CSV export
  const formattedData = data?.map((user) => {
    const filtered = {};
    requiredKeys.forEach((key) => {
      let value = user[key];

      if (key === 'sign_up_date' && value) {
        const date = new Date(value);
        filtered[key] = date.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (key === 'reconcile_to_journal') {
        filtered[key] = value === 1 ? 'Yes' : 'No';
      } else {
        filtered[key] = value;
      }
    });
    return filtered;
  });

  const columns = requiredKeys.map((key) => ({
    id: key,
    displayName: headerMap[key] || key,
  }));

  return (
    <>
      <main>
        <div className="influ-in">
          {/* Back link */}
          <h3>
            <Link to="/client-ledger">
              <img src="/images/back-icon.svg" alt="" />
            </Link>
          </h3>

          {/* Client info display */}
          <div className="dsbrd-client-info-wrp align-items-start">
            <div className="dsbrd-client-info-left">
              <strong>Account Name : <span className="client-name">{clientInfo?.account_name}</span></strong>
              <strong>Firm Name : <span className="farm-name">{query_firm_name}</span></strong>
              <p>Bank :  <span className="bank-name">{clientInfo?.bank_name}</span></p>
              <p>Account Open Date : <span className="date">{clientInfo?.account_open_date}</span></p>
              <p>Case Open Date : <span className="date">{caseData?.open_date && new Date(caseData?.open_date).toLocaleDateString('en-CA')}</span></p>
            </div>
            <div className="dsbrd-client-info-right">
              <strong>Current Month and Year : <span className="currmnth-yr">{new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</span> </strong>
              <strong>Account : <span className="account-no">{displayAccountNumber(clientInfo?.account_number)}</span></strong>
              <p>Account Close Date :  <span className="close-date">{clientInfo?.account_close_date}</span></p>
              <p>Case Name :  <span className="close-date">{caseData?.name}</span></p>
              <p>Case Close Date :  <span className="close-date">{caseData?.close_date && new Date(caseData?.close_date).toLocaleDateString('en-CA')}</span></p>
            </div>
          </div>

          {/* Search and action buttons */}
          <div className="influ-strip-2">
            <form>
              <div className="influ-search">
                <label htmlFor="">
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button disabled style={{ cursor: 'pointer' }}>
                    <img src="/images/search.svg" alt="" />
                  </button>
                </label>
              </div>
              <div className="influ-btns">
                {/* CSV Export */}
                <button type="button" className="influ-btn">
                  <CsvDownloader filename={`ledger_${clientInfo?.client_name}`} extension=".csv" columns={columns} datas={formattedData}>
                    <img src="/images/menu-icons/export-icon.svg" alt="" />
                    <img src="/images/filter-icons/export.svg" alt="" /> Export CSV
                  </CsvDownloader>
                </button>

                {/* Date range filter */}
                <DesignerDateRangePicker onApply={handleApply} onCancel={handleCancel} />

                {/* Add Ledger */}
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#add-pop"
                  className="influ-btn"
                  onClick={() => {
                    setstatus("add");
                  }}
                >
                  Add Ledger
                </button>
              </div>
            </form>
          </div>

          {/* Ledger table */}
          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  {/* Table headers with sorting */}
                  <tr>
                    <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S. No.{getSortArrow("serial_no")}</th>
                    <th onClick={() => handleSort("signup_date")} style={{ cursor: "pointer" }}>Date {getSortArrow("signup_date")}</th>
                    <th onClick={() => handleSort("payee_name")} style={{ cursor: "pointer" }}>Payee Name {getSortArrow("payee_name")}</th>
                    <th onClick={() => handleSort("transection_method")} style={{ cursor: "pointer" }}>Transaction Method {getSortArrow("transection_method")}</th>
                    <th onClick={() => handleSort("cheque_number")} style={{ cursor: "pointer" }}>Check Number {getSortArrow("cheque_number")}</th>
                    <th onClick={() => handleSort("purpose")} style={{ cursor: "pointer" }}>Purpose {getSortArrow("purpose")}</th>
                    <th onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>Deposit Amount {getSortArrow("deposit_amount")}</th>
                    <th onClick={() => handleSort("disbursement_amount")} style={{ cursor: "pointer" }}>Disbursement Amount {getSortArrow("disbursement_amount")}</th>
                    <th onClick={() => handleSort("case_ledger_balance")} style={{ cursor: "pointer" }}>Running Balance {getSortArrow("case_ledger_balance")}</th>
                    <th onClick={() => handleSort("notes")} style={{ cursor: "pointer" }}>Notes {getSortArrow("notes")}</th>
                    <th>Reconciled to Journal</th>
                    <th>Action</th>
                  </tr>

                  {/* Table rows */}
                  {paginatedData?.length > 0 ? (
                    paginatedData?.map((item) => (
                      <tr key={item?.serial_no}>
                        <td>{item?.serial_no}.</td>
                        <td>{item?.date}</td>
                        <td>{item?.payee_name}</td>
                        <td>{item?.transaction_method}</td>
                        <td>{item?.cheque_number}</td>
                        <td>{item?.purpose}</td>
                        <td>${item?.deposit_amount?.toLocaleString()}</td>
                        <td>${item?.disbursement_amount?.toLocaleString()}</td>
                        <td>${item?.case_ledger_balance?.toLocaleString()}</td>
                        <td>{item?.notes}</td>
                        <td>{item?.reconcile_to_journal
                          ? <img src="/images/filter-icons/green-tick.png" alt="" />
                          : <img src="/images/filter-icons/red-cross.png" alt="" />}</td>
                        <td>
                          {/* Edit and Delete buttons */}
                          <Link
                            to="#"
                            className="primary-btn-cstm-icon me-3"
                            title="Edit"
                            data-bs-toggle="modal"
                            data-bs-target="#add-pop"
                            onClick={() => {
                              setstatus("edit");
                              setSelectedItem(item);
                            }}
                          >
                            <img src="/images/edit.svg" alt="Edit" />
                          </Link>
                          <Link
                            to="#"
                            className="primary-btn-cstm-icon"
                            title="Delete"
                            data-bs-toggle="modal"
                            data-bs-target="#delete-pop"
                            onClick={() => setDeletedId(item)}
                          >
                            <img src="/images/delete.svg" alt="Delete" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center" style={{ padding: "40px", fontWeight: "bolder", fontSize: "20px" }}>
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination and rows-per-page selector */}
            <div className="select-item-count">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>{option} per page</option>
                ))}
              </select>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={10}
              totalItems={data.length}
              onPageChange={(page) => {
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
            />
          </div>
        </div>
      </main>

      {/* Modals for Add/Edit and Delete */}
      <AddClientLedger
        editedData={selectedItem}
        client={clientsForLedgers[0]}
        status={status}
        case_id={query_case_id}
        client_id={query_trust_account_id}
        ledger_client_name={clientInfo?.client_name}
        onSuccess={() => {
          dispatch(getClientLedger({
            firm_name: query_firm_name,
            case_id: query_case_id,
            purpose: query_purpose,
            account_id: query_trust_account_id
          }));
        }}
      />
      <DeletePopup confirmDelete={handleDelete} currentData={deletedId} />
    </>
  );
};

export default GetLedger;
