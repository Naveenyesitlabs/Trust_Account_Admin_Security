import { useEffect, useMemo, useRef, useState } from "react"; // React hooks
import CsvDownloader from "react-csv-downloader"; // CSV export functionality
import "react-date-range/dist/styles.css"; // Date range picker styles
import "react-date-range/dist/theme/default.css"; // Date range picker theme
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Link } from "react-router-dom"; // For navigation
import AddTrustAccount from "../component/AddTrustAccount"; // Modal component to add/edit trust account
import DeletePopup from "../component/DeletePopup"; // Modal component to confirm deletion
import DesignerDateRangePicker from "../component/DesignerDateRangePicker"; // Custom date range picker
import Pagination from "../component/Pagination"; // Pagination component
import { useMultipleDateRange } from "../hooks/useMultipleDateRange"; // Custom hook for filtering by multiple date ranges
import useSortableData from "../hooks/useSortableData"; // Custom hook for table sorting
import {
  deleteTrustAccount,
  getAllClientTrustAccount,
} from "../redux/slices/clientTrustSlice"; // Redux actions
import { displayAccountNumber } from "../utils/helper"; // Helper to mask/display account numbers

const ManageClientTrustAccount = () => {
  const wrapperRef = useRef(null); // Ref for click outside detection for date picker
  const dispatch = useDispatch(); // Redux dispatch
  const { trustAccount, loading } = useSelector(
    (state) => state.trustAccount
  ); // Redux state
  const [currentUser, setCurrentUser] = useState(null); // Currently selected user for edit/delete
  const [data, setData] = useState(trustAccount); // Full trust account data
  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [filteredData, setFilteredData] = useState([]); // Data after search/filter

  const [perPage, setPerPage] = useState(50); // Items per page for pagination

  // Fetch all client trust accounts on component mount
  useEffect(() => {
    dispatch(getAllClientTrustAccount());
  }, [dispatch]);

  // Update data state whenever trustAccount from Redux changes
  useEffect(() => {
    setData(trustAccount || []);
  }, [trustAccount]);

  // Filter data based on search term
  useEffect(() => {
    const filtered = !searchTerm
      ? data
      : data?.filter(
        (item) =>
          item?.account_name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          item?.account_number
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          item?.bank_name
            ?.toLowerCase()
            ?.includes(searchTerm.toLowerCase()) ||
          item?.firm_name?.toLowerCase()?.includes(searchTerm.toLowerCase())
      );

    setFilteredData(filtered || []);
  }, [searchTerm, data]);

  // Reset to first page whenever filtered data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  // Adjust current page if items per page or filtered data changes
  useEffect(() => {
    if ((currentPage - 1) * perPage >= filteredData.length && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [filteredData, currentPage, perPage]);


  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData); // Table sorting logic
  const getSortArrow = (key) =>
    sortConfig?.key === key
      ? sortConfig?.direction === "asc"
        ? " ↑"
        : " ↓"
      : ""; // Arrow indicator for sorted column

  const perPageOptions = [50, 100]; // Options for items per page dropdown

  // Compute paginated data based on current page and items per page
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedData?.slice(start, start + perPage);
  }, [sortedData, currentPage, perPage]);

  const totalPages = Math.ceil(sortedData?.length / perPage); // Total pages for pagination

  // Handle trust account deletion
  const handleDelete = async (data) => {
    try {
      await dispatch(deleteTrustAccount(data?.clientId));
    } catch (error) {
      console.error("Error deleting trust account:", error);
    } finally {
      setCurrentUser(null);
      dispatch(getAllClientTrustAccount()); // Refresh data after deletion
    }
  };

  // Open Add Trust Account modal
  const addTrustAccount = () => {
    setCurrentUser(null); // Clear current user for new entry
    document.body.classList.remove("modal-open"); // Remove modal open class
    const backdrops = document.querySelectorAll(".modal-backdrop"); // Remove old backdrops
    backdrops.forEach((backdrop) => backdrop.remove());
  };

  // Open Edit Trust Account modal
  const updateTrustAccount = (item) => {
    setCurrentUser(item); // Set selected user for editing
    document.body.classList.remove("modal-open");
    const backdrops = document.querySelectorAll(".modal-backdrop");
    backdrops.forEach((backdrop) => backdrop.remove());
  };

  // Format date for display in table
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
  };

  // Columns for CSV export
  const columns = [
    { id: "serial_no", displayName: "serial_no" },
    { id: "firm_name", displayName: "firm_name" },
    { id: "bank_name", displayName: "bank_name" },
    { id: "account_name", displayName: "account_name" },
    { id: "account_number", displayName: "account_number" },
    { id: "month", displayName: "month" },
    { id: "year", displayName: "year" },
    { id: "account_open_date", displayName: "account_open_date" },
    { id: "account_close_date", displayName: "account_close_date" },
  ];

  // Hook for filtering data by multiple date ranges
  const { handleApply, handleCancel } = useMultipleDateRange({
    data: data,
    dateKeys: ["account_open_date", "account_close_date"], // Fields to filter by
    onFilter: setFilteredData,
  });

  // Format date for CSV export in YYYY-MM-DD format
  const formatDateForCSV = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Prepare CSV data
  const csvData = filteredData?.map((item) => ({
    ...item,
    account_open_date: formatDateForCSV(item.account_open_date),
    account_close_date: formatDateForCSV(item.account_close_date),
  }));


  return (
    <>
      <main>
        <div className="influ-in">
          <div className="influ-strip-2">
            <form>
              {/* Search Input */}
              <div className="influ-search">
                <label>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button disabled style={{ cursor: "pointer" }}>
                    <img src="/images/search.svg" alt="" />
                  </button>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="influ-btns">
                {/* CSV Export */}
                <button type="button" className="influ-btn">
                  <CsvDownloader
                    filename="trust-accounts"
                    extension=".csv"
                    columns={columns}
                    datas={csvData}
                  >
                    <div role="button" tabIndex="0">
                      <img alt="" src="images/menu-icons/export-icon.svg" />
                      <img alt="" src="images/filter-icons/export.svg" />
                      Export in CSV
                    </div>
                  </CsvDownloader>
                </button>

                {/* Date Range Picker */}
                <div style={{ position: "relative" }} ref={wrapperRef}>
                  <DesignerDateRangePicker
                    onApply={handleApply}
                    onCancel={handleCancel}
                  />
                </div>

                {/* Add Trust Account */}
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#add-pop"
                  className="influ-btn"
                  onClick={addTrustAccount}
                >
                  Add trust account
                </button>
              </div>
            </form>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center" }}>
              Loading...
            </div>
          ) : (
            <div className="influ-table">
              <div id="table-responsive-1" className="table-responsive">
                <table>
                  <tbody>
                    {/* Table Header */}
                    <tr>
                      <th onClick={() => handleSort("serial_no")}>S. No.</th>
                      <th onClick={() => handleSort("firm_name")}>
                        Firm Name {getSortArrow("firm_name")}
                      </th>
                      <th onClick={() => handleSort("bank_name")}>
                        Bank Name {getSortArrow("bank_name")}
                      </th>
                      <th onClick={() => handleSort("account_name")}>
                        Account Name {getSortArrow("account_name")}
                      </th>
                      <th onClick={() => handleSort("account_number")}>
                        Account Number {getSortArrow("account_number")}
                      </th>
                      <th onClick={() => handleSort("month_year")}>
                        Month/Year {getSortArrow("month_year")}
                      </th>
                      <th onClick={() => handleSort("account_open_date")}>
                        Account Open Date {getSortArrow("account_open_date")}
                      </th>
                      <th onClick={() => handleSort("account_close_date")}>
                        Account Close Date {getSortArrow("account_close_date")}
                      </th>
                      <th>Action</th>
                    </tr>

                    {/* Table Rows */}
                    {paginatedData?.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <tr key={index}>
                          <td>{item?.serial_no}.</td>
                          <td>{item?.firm_name}</td>
                          <td>{item?.bank_name}</td>
                          <td>{item?.account_name}</td>
                          <td>{displayAccountNumber(item?.account_number)}</td>
                          <td>
                            {item?.month} / {item?.year}
                          </td>
                          <td>{formatDate(item?.account_open_date)}</td>
                          <td>{formatDate(item?.account_close_date)}</td>

                          {/* Actions: Edit / Delete */}
                          <td>
                            <Link
                              to="#"
                              title="Edit"
                              data-bs-toggle="modal"
                              data-bs-target="#add-pop"
                              onClick={() => updateTrustAccount(item)}
                            >
                              <img src="images/edit.svg" alt="Edit" />
                            </Link>
                            <Link
                              to="#"
                              title="Delete"
                              data-bs-toggle="modal"
                              data-bs-target="#delete-pop"
                              onClick={() => setCurrentUser(item)}
                            >
                              <img src="images/delete.svg" alt="Delete" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center"
                          style={{
                            padding: "40px",
                            fontWeight: "bolder",
                            fontSize: "20px",
                          }}
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Items per page dropdown */}
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

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={10} // or your actual page size
                totalItems={data.length} // total number of items
                onPageChange={(page) => {
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddTrustAccount currentUser={currentUser} />
      <DeletePopup confirmDelete={handleDelete} currentData={currentUser} />
    </>
  );
};

export default ManageClientTrustAccount;
