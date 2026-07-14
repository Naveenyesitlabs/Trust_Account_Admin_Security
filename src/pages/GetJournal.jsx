import { useEffect, useMemo, useState } from "react";
import CsvDownloader from "react-csv-downloader";
import "react-date-range/dist/styles.css"; // main style file for date range picker
import "react-date-range/dist/theme/default.css"; // theme css file for date range picker
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import AddCaseModal from "../component/AddCaseModal";
import AddJurnalEntry from "../component/AddJurnalEntry"; // Modal component for adding/editing journal entry
import DeletePopup from "../component/DeletePopup"; // Modal component for delete confirmation
import DesignerDateRangePicker from "../component/DesignerDateRangePicker"; // Custom date range picker
import Pagination from "../component/Pagination"; // Pagination component
import { useDateRangeFilter } from "../hooks/useDateRangeFilter"; // Custom hook for filtering by date range
import useSortableData from "../hooks/useSortableData"; // Custom hook for table sorting
import {
  deleteJournalEntry,
  getClientLedger,
  getJournalEntry,
} from "../redux/slices/adminSlice"; // Redux actions
import { displayAccountNumber } from "../utils/helper"; // Helper function to format account numbers

const GetJournal = () => {
  // Local state
  const [currentUser, setCurrentUser] = useState(null); // Currently selected journal entry for edit
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [currentPage, setCurrentPage] = useState(1); // Pagination current page
  const { journalEntry } = useSelector((state) => state.admin); // Get journal data from Redux
  const [data, setData] = useState(journalEntry?.journals); // Raw journal data
  const [deletedId, setDeletedId] = useState(""); // ID of journal entry to delete
  const [status, setstatus] = useState(""); // Status for modal ("add" or "edit")
  const [filteredData, setFilteredData] = useState(data); // Filtered journal data
  const [perPage, setPerPage] = useState(50); // Number of rows per page

  // Get query params from URL
  const urlParams = new URLSearchParams(window.location.search);
  const query_bank_name = urlParams.get('bank_name');
  const query_account_number = urlParams.get('account_number');
  const query_account_name = urlParams.get('account_name');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Fetch journal entries when URL params change
   */
  useEffect(() => {
    dispatch(
      getJournalEntry({
        bank_name: query_bank_name,
        account_number: query_account_number,
        account_name: query_account_name,
      })
    );
  }, [query_bank_name, query_account_number, query_account_name]);

  /**
   * Update local data state when Redux journalEntry changes
   */
  useEffect(() => {
    if (!journalEntry || !journalEntry.journals) return;
    setData(journalEntry.journals);
  }, [journalEntry]);

  /**
   * Filter data based on search term
   */
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
          item?.client_name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Custom hook to sort table data
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);

  // Helper to display sort arrow in table headers
  const getSortArrow = (key) =>
    sortConfig?.key === key
      ? sortConfig?.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const perPageOptions = [50, 100]; // Options for rows per page

  // Paginate sorted data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedData?.slice(start, start + perPage);
  }, [sortedData, currentPage, perPage]);

  const totalPages = Math.ceil(sortedData?.length / perPage); // Total number of pages

  /**
   * Delete a journal entry and refresh data
   */
  const handleDelete = async (data) => {
    const response = await dispatch(deleteJournalEntry(data.id));
    if (response?.payload?.success) {
      // Refresh journal entries after deletion
      dispatch(
        getJournalEntry({
          bank_name: journalEntry?.client?.bank_name,
          account_number: journalEntry?.client?.account_number,
          account_name: journalEntry?.client?.account_name,
        })
      );
    }
  };

  /**
   * Handle filtering by date range
   */
  const { handleApply, handleCancel } = useDateRangeFilter({
    data: data,
    dateKey: 'date',
    onFilter: setFilteredData,
  });

  /**
   * Navigate to client ledger page on client name click
   */
  const handleClientNameClick = async (firm_name, client_name, purpose, ledger_client_id, case_id) => {
    const data = await dispatch(getClientLedger({ firm_name: firm_name, client_name: client_name, purpose: "", account_id: ledger_client_id, case_id: case_id }));
    console.log("Firm name: ",firm_name, "Client Name: ", client_name, "Ledger Client ID: ", ledger_client_id, "Case ID: ", case_id);
    console.log("Client Ledger Response: ", data);
    if (data.payload.success) {
      // Navigate to ledger page with query params
      navigate(`/client-ledger/get-ledger?client_name=${client_name}&purpose=${purpose}&firm_name=${firm_name}&client_id=${journalEntry?.client?.clientId}&account_id=${ledger_client_id}&bank_name=${journalEntry?.client?.bank_name}&account_number=${journalEntry?.client?.account_number}&account_name=${journalEntry?.client?.account_name}&case_id=${case_id}`);
      // Store selected ledger info in localStorage
      localStorage.setItem("ledgerData", JSON.stringify({
        client_name: client_name,
        purpose: purpose,
        firm_name: firm_name,
        client_id: journalEntry?.client?.clientId,
        account_id: ledger_client_id,
        case_id: case_id,
        trust_account_id: journalEntry?.client?.clientId
      }));
    }
  }

  // Keys to include in CSV export
  const requiredKeys = [
    'serial_no', 'date', 'payee_name', 'transaction_method', 'cheque_number',
    'purpose', 'deposit_amount', 'disbursement_amount', 'running_balance',
    'notes', 'client_name', 'reconciled_to_ledger', 'reconciled_to_bank_statement'
  ];

  // Map of CSV header labels
  const headerMap = {
    serial_no: "Serial no",
    date: "Date",
    payee_name: "Payee Name",
    transaction_method: "Transaction Method",
    cheque_number: "Cheque Number",
    purpose: "Purpose",
    deposit_amount: "Deposit Amount",
    disbursement_amount: "Disbursement Amount",
    running_balance: "Running Balance",
    notes: "Notes",
    client_name: "Client Name",
    reconciled_to_ledger: "Reconciled to Ledger",
    reconciled_to_bank_statement: "Reconciled to Bank Statement",
  };

  /**
   * Format data for CSV export
   */
  const formattedData = data?.map((user) => {
    const filtered = {};
    requiredKeys.forEach((key) => {
      let value = user[key];

      // Format specific fields
      if (key === 'sign_up_date' && value) {
        const date = new Date(value);
        filtered[key] = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      } else if (key === 'reconciled_to_ledger') {
        filtered[key] = value === 1 ? 'Yes' : 'No';
      } else if (key === 'reconciled_to_bank_statement') {
        filtered[key] = value === 1 ? 'Yes' : 'No';
      } else {
        filtered[key] = value;
      }
    });
    return filtered;
  });

  // Columns definition for CSV export
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
            <Link to="/journal-entry">
              <img src="/images/back-icon.svg" alt="" />
            </Link>
          </h3>

          {/* Client account info */}
          <div className="dsbrd-client-info-wrp align-items-start">
            <div className="dsbrd-client-info-left">
              <strong>Account Name : <span className="client-name">{journalEntry?.client?.account_name}</span></strong>
              <strong>Firm Name : <span className="farm-name">{journalEntry?.client?.firm_name}</span></strong>
              <p>Bank :  <span className="bank-name">{journalEntry?.client?.bank_name}</span></p>
              <p>Account Open Date : <span className="date">{journalEntry?.client?.account_open_date}</span></p>
            </div>
            <div className="dsbrd-client-info-right">
              <strong>Current Month and Year : <span className="currmnth-yr">{new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}</span> </strong>
              <strong>Account : <span className="account-no">{displayAccountNumber(journalEntry?.client?.account_number)}</span></strong>
              <p>Account Close Date :  <span className="close-date">{journalEntry?.client?.account_close_date}</span></p>
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
                  <CsvDownloader filename={`journal_${journalEntry?.client?.account_number}`} extension=".csv" columns={columns} datas={formattedData}>
                    <img src="/images/menu-icons/export-icon.svg" alt="" />
                    <img src="/images/filter-icons/export.svg" alt="" /> Export CSV
                  </CsvDownloader>
                </button>

                {/* Date Range Filter */}
                <DesignerDateRangePicker onApply={handleApply} onCancel={handleCancel} />

                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#add-case-pop"
                  className="influ-btn"
                  onClick={() => {
                    setCurrentUser(null);
                    setstatus("add");
                  }}
                >
                  Add Case
                </button>

                {/* Add Journal Entry */}
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#add-pop"
                  className="influ-btn"
                  onClick={() => {
                    setCurrentUser(null);
                    setstatus("add");
                  }}
                >
                  Add Journal Entry
                </button>

              </div>
            </form>
          </div>

          {/* Journal Table */}
          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  <tr>
                    {/* Table headers with sorting */}
                    <th onClick={() => handleSort("serial_no")} style={{ cursor: "pointer" }}>S. No.{getSortArrow("serial_no")}</th>
                    <th onClick={() => handleSort("date")} style={{ cursor: "pointer" }}>Date {getSortArrow("date")}</th>
                    <th onClick={() => handleSort("payee_name")} style={{ cursor: "pointer" }}>Payee Name {getSortArrow("payee_name")}</th>
                    <th onClick={() => handleSort("transaction_method")} style={{ cursor: "pointer" }}>Transaction Method {getSortArrow("transaction_method")}</th>
                    <th onClick={() => handleSort("cheque_number")} style={{ cursor: "pointer" }}>Check Number {getSortArrow("cheque_number")}</th>
                    <th onClick={() => handleSort("purpose")} style={{ cursor: "pointer" }}>Purpose {getSortArrow("purpose")}</th>
                    <th onClick={() => handleSort("deposit_amount")} style={{ cursor: "pointer" }}>Deposit Amount {getSortArrow("deposit_amount")}</th>
                    <th onClick={() => handleSort("disbursement_amount")} style={{ cursor: "pointer" }}>Disbursement Amount {getSortArrow("disbursement_amount")}</th>
                    <th onClick={() => handleSort("running_balance")} style={{ cursor: "pointer" }}>Running Balance {getSortArrow("running_balance")}</th>
                    <th onClick={() => handleSort("notes")} style={{ cursor: "pointer" }}>Notes {getSortArrow("notes")}</th>
                    <th>Client Name</th>
                    <th>Case</th>
                    <th>Reconciled to Ledger</th>
                    <th>Reconciled to Bank Statement?</th>
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
                        <td>${item?.running_balance?.toLocaleString()}</td>
                        <td>{item?.notes}</td>
                        <td>
                          <a href="#" onClick={() =>{ handleClientNameClick(item?.firm_name, item?.client_name, '', item?.ledger_client_id, item?.case_id)}}>
                            {item?.client_name}
                          </a>
                        </td>
                        <td>{item?.case_name}</td>
                        <td>{item?.reconciled_to_ledger ? <img src="/images/filter-icons/green-tick.png" alt="" /> : <img src="/images/filter-icons/red-cross.png" alt="" />}</td>
                        <td>{item?.reconciled_to_bank_statement ? <img src="/images/filter-icons/green-tick.png" alt="" /> : <img src="/images/filter-icons/red-cross.png" alt="" />}</td>
                        <td>
                          {/* Edit and Delete actions */}
                          <Link to="#" className="primary-btn-cstm-icon me-3" title="Edit" data-bs-toggle="modal" data-bs-target="#add-pop" onClick={() => { setCurrentUser(item); setstatus("edit"); }}>
                            <img src="/images/edit.svg" alt="Edit" />
                          </Link>
                          <Link to="#" className="primary-btn-cstm-icon" title="Delete" data-bs-toggle="modal" data-bs-target="#delete-pop" onClick={() => setDeletedId(item)}>
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

            {/* Pagination and per-page selection */}
            <div className="select-item-count">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={10} // Placeholder page size
              totalItems={journalEntry?.journals?.length || 0} // Total items
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
      <AddJurnalEntry editData={currentUser} status={status} client={journalEntry?.client} />
      <AddCaseModal editData={currentUser} status={status} client={journalEntry?.client} />
      <DeletePopup confirmDelete={handleDelete} currentData={deletedId} />
    </>
  );
};

export default GetJournal;
