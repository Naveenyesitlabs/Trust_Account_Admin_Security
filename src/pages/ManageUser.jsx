import moment from "moment"; // For formatting dates
import { useEffect, useMemo, useState } from "react"; // React hooks
import CsvDownloader from "react-csv-downloader"; // CSV export
import "react-date-range/dist/styles.css"; // Date range picker styles
import "react-date-range/dist/theme/default.css"; // Date range picker theme
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Link } from "react-router-dom"; // Navigation links
import AccessModal from "../component/AccessModal"; // Modal to update user access
import AddEditUser from "../component/AddUserModal"; // Modal to add/edit user
import DeletePopup from "../component/DeletePopup"; // Modal to confirm deletion
import DesignerDateRangePicker from "../component/DesignerDateRangePicker"; // Custom date range picker
import Pagination from "../component/Pagination"; // Pagination component
import { useDateRangeFilter } from "../hooks/useDateRangeFilter"; // Hook for filtering by date range
import useSortableData from "../hooks/useSortableData"; // Hook for sorting table
import { deleteUser, getAllUsers } from "../redux/slices/adminSlice"; // Redux actions
import { getStoredSession } from "../utils/authStorage";
import { toSentenceCase } from "../utils/helper"; // Helper to format text

const ManageUser = () => {
  const [currentUser, setCurrentUser] = useState(null); // User selected for edit/delete
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [data, setData] = useState([]); // Full user data
  const [userAccsess, setUserAccsess] = useState({}); // State for access modal updates
  const { allUsers } = useSelector((state) => state.admin); // Get all users from Redux state
  const [filteredData, setFilteredData] = useState(data); // Filtered data based on search/date
  const [perPage, setPerPage] = useState(50); // Items per page dropdown

  // Get logged-in admin info from localStorage
  const admin = getStoredSession();
  const admin_id = admin?.user?.userid || 0;

  const dispatch = useDispatch(); // Redux dispatch


  // Fetch all users on mount
  useEffect(() => {
    dispatch(getAllUsers({ admin_id }));
  }, [dispatch]);

  // Update local data state whenever Redux allUsers changes
  useEffect(() => {
    setData(allUsers);
  }, [allUsers, dispatch]);

  // Filter users based on search input
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const filtered = data?.filter(
        (item) =>
          item?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          item?.designation?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // Sort logic
  const { sortedData, sortConfig, handleSort } = useSortableData(filteredData);
  const getSortArrow = (key) =>
    sortConfig?.key === key
      ? sortConfig?.direction === "asc"
        ? " ↑"
        : " ↓"
      : "";

  const perPageOptions = [50, 100]; // Dropdown options for items per page

  // Paginate the sorted data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedData?.slice(start, start + perPage);
  }, [sortedData, currentPage, perPage]);

  const totalPages = Math.ceil(sortedData?.length / perPage); // Total pages for pagination

  // Handle user deletion
  const handleDelete = async (data) => {
    await dispatch(deleteUser(data.id)); // Delete user
    await dispatch(getAllUsers({ admin_id })); // Refresh user list
    setCurrentUser(null); // Clear current user
  };

  // Keys to include in CSV export
  const requiredKeys = [
    "serial_no",
    "name",
    "email",
    "designation",
    "sign_up_date",
    "assign_role",
    "access",
  ];

  // Format users for CSV export
  const formattedUsers = allUsers?.map((user) => {
    const filtered = {};
    requiredKeys.forEach((key) => {
      if (key === "sign_up_date") {
        const date = new Date(user[key]);
        const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD
        filtered[key] = formattedDate;
      } else {
        filtered[key] = user[key];
      }
    });
    return filtered;
  });

  // CSV column headers
  const columns =
    formattedUsers.length > 0
      ? requiredKeys.map((key) => ({
        id: key,
        displayName: toSentenceCase(key),
      }))
      : [];

  // Toggle user access modal state
  const handleAccessUpdate = async (status, id) => {
    const newStatus = status ? "denied" : "granted";
    const userAccsessModal = {
      id: id,
      access: newStatus,
    };
    setUserAccsess(userAccsessModal); // Show access modal
  };

  // Hook for filtering users by sign up date
  const { handleApply, handleCancel } = useDateRangeFilter({
    data: data,
    dateKey: "sign_up_date",
    onFilter: setFilteredData,
  });

  return (
    <>
      <main>
        <div className="influ-in">
          <div className="influ-strip-2">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Search Box */}
              <div className="influ-search">
                <label htmlFor="">
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
                {/* Date Range Picker */}
                <DesignerDateRangePicker
                  onApply={handleApply}
                  onCancel={handleCancel}
                  placeholder="Sign Up Date Range"
                />

                {/* CSV Export */}
                <button type="button" className="influ-btn">
                  <CsvDownloader
                    filename="report"
                    extension=".csv"
                    columns={columns}
                    datas={formattedUsers}
                  >
                    <img src="images/menu-icons/export-icon.svg" alt="" />
                    <img src="images/filter-icons/export.svg" alt="" /> Export
                    CSV
                  </CsvDownloader>
                </button>

                {/* Add User */}
                <button
                  type="button"
                  className="influ-btn"
                  data-bs-toggle="modal"
                  data-bs-target="#addUser"
                  onClick={() => setCurrentUser(null)} // Clear currentUser for new user
                >
                  Add New User
                </button>
              </div>
            </form>
          </div>

          {/* Users Table */}
          <div className="influ-table">
            <div id="table-responsive-1" className="table-responsive">
              <table>
                <tbody>
                  {/* Table Header */}
                  <tr>
                    <th onClick={() => handleSort("serial_no")}>
                      S. No. {getSortArrow("serial_no")}
                    </th>
                    <th onClick={() => handleSort("name")}>
                      Name {getSortArrow("name")}
                    </th>
                    <th onClick={() => handleSort("email")}>
                      Email {getSortArrow("email")}
                    </th>
                    <th onClick={() => handleSort("designation")}>
                      Designation {getSortArrow("designation")}
                    </th>
                    <th onClick={() => handleSort("sign_up_date")}>
                      Sign Up Date {getSortArrow("sign_up_date")}
                    </th>
                    <th onClick={() => handleSort("assign_role")}>
                      Assign role {getSortArrow("assign_role")}
                    </th>
                    <th>Access</th>
                    <th>Action</th>
                  </tr>

                  {/* Show message if no data */}
                  {paginatedData?.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
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

                  {/* Table Rows */}
                  {paginatedData?.map((item) => (
                    <tr key={item?.serial_no}>
                      <td>{item?.serial_no}.</td>
                      <td>{item?.name}</td>
                      <td>{item?.email}</td>
                      <td>{item?.designation}</td>
                      <td>
                        {moment(item?.sign_up_date).format("DD MMM YYYY")}
                      </td>
                      <td>{item?.role_name}</td>

                      {/* Access Toggle */}
                      <td>
                        <div className="table-toggle">
                          <h4
                            style={{
                              color:
                                item?.access === "granted"
                                  ? "green"
                                  : "#454545",
                            }}
                          >
                            Granted
                          </h4>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={item?.access !== "granted"}
                              onChange={(e) =>
                                handleAccessUpdate(e.target.checked, item.id)
                              }
                              data-bs-toggle="modal"
                              data-bs-target="#suspend-pop"
                            />
                            <span className="slider round"></span>
                          </label>
                          <h4
                            style={{
                              color:
                                item?.access !== "granted" ? "red" : "#454545",
                            }}
                          >
                            Denied
                          </h4>
                        </div>
                      </td>

                      {/* Edit / Delete */}
                      <td>
                        <Link
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#addUser"
                          onClick={() => setCurrentUser({ ...item })} // Load user data into modal for edit
                        >
                          <img src="images/edit.svg" alt="Edit" />
                        </Link>
                        <Link
                          to="#"
                          onClick={() => setCurrentUser(item)} // Load user data for deletion
                          data-bs-toggle="modal"
                          data-bs-target="#delete-pop"
                        >
                          <img src="images/delete.svg" alt="Delete" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Items per page dropdown */}
            <div className="select-item-count">
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page
                }}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
            </div>

            {/* Pagination Component */}
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

      {/* Modals */}
      <DeletePopup confirmDelete={handleDelete} currentData={currentUser} />
      <AccessModal updateStatus={userAccsess} admin_id={admin_id} />
      <AddEditUser
        editData={currentUser?.id ? currentUser : null}
        admin_id={admin_id}
      />
    </>
  );
};

export default ManageUser;
