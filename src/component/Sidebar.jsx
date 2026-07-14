import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/authStorage";

// 🔹 Sidebar component
// - Props:
//   • showSidebar → boolean to control sidebar visibility
const Sidebar = ({ showSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Logout handler
  const handleLogout = () => {
    // Hide the logout modal manually using Bootstrap 5 API
    const modalElement = document.getElementById("logout");
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }

    // Remove user session/localStorage and navigate to home page
    clearAuthSession();
    navigate("/");
  };

  return (
    <>
      {/* 🔹 Sidebar section */}
      <section id="sidebar" className={showSidebar ? "hide" : ""}>
        {/* 🔹 Brand / Logo */}
        <Link to="#" className="brand">
          <img src="/images/logo.svg" alt="" />
          <span>Trust Account <br />{" "} Reconciliation</span>
        </Link>

        {/* 🔹 Sidebar menu */}
        <ul className="side-menu">
          {/* 🔹 Single menu item example */}
          <li className={`${location.pathname === "/manage-user" ? "active" : ""}`}>
            <Link to="manage-user">
              <img src="/images/menu-icons/1.svg" alt="" />
              <span className="text">Manage Users</span>
            </Link>
          </li>

          {/* 🔹 Manage Role menu item */}
          <li className={`${location.pathname === "/create-role" ? "active" : ""}`}>
            <Link to="/create-role">
              <img
                src="/images/menu-icons/admin-side-icon-2.svg"
                alt="Icon"
                style={{
                  background: "white",
                  borderRadius: "5px",
                  padding: "2px",
                }}
              />
              <span className="text">Manage Role</span>
            </Link>
          </li>

          {/* 🔹 Manage Clients Trust Accounts */}
          <li className={`${location.pathname === "/manage-clients-trust-accounts" ? "active" : ""}`}>
            <Link to="manage-clients-trust-accounts">
              <img src="/images/menu-icons/2.svg" alt="" />
              <span className="text">Manage Clients Trust Accounts</span>
            </Link>
          </li>

          {/* 🔹 Dropdown menu example */}
          <li
            className={["/journal-entry", "/client-ledger"].includes(location.pathname) ? "active" : ""}
          >
            <Link
              to="#"
              className={`sidebar-dropdown-btn `}
              onClick={(e) => e.preventDefault()} // Prevent default link behavior
            >
              <img src="/images/menu-icons/4.svg" alt="" />
              <span className="text">Manage Firm Accounting</span>
              <img
                src="/images/dropdown.svg"
                alt=""
                className="sidebar-dropdown-icon"
              />
            </Link>
          </li>

          {/* 🔹 Dropdown items (initially hidden) */}
          <div className="sidebar-dropdown-list" style={{ display: "none" }}>
            <Link to="journal-entry">Journal Entry</Link>
            <Link to="client-ledger">Client Ledger</Link>
          </div>

          {/* 🔹 Logout menu item */}
          <li>
            <Link
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#logout"
              data-dismiss="modal"
            >
              <img src="/images/menu-icons/6.svg" alt="" />
              <span className="text">Logout</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* 🔹 Logout modal popup */}
      <div
        className="modal animate__animated animate__bounceIn my-popup"
        id="logout"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog modal-dialog-edit" role="document">
          <div className="modal-content clearfix">
            {/* 🔹 Close button */}
            <div className="modal-heading">
              <button
                type="button"
                className="close close-btn-front"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="/images/fill-cross-pop.svg" alt="" />
                </span>
              </button>
            </div>

            {/* 🔹 Modal body */}
            <div className="modal-body">
              <div className="delete-pop-wrap">
                <form>
                  <div className="delete-pop-inner">
                    <img src="/images/logout-pop.svg" alt="" />
                    <h3>Logout</h3>
                    <p>Are you sure you want to logout?</p>
                  </div>
                  <div className="delete-pop-btn">
                    {/* 🔹 Confirm logout */}
                    <Link to="" onClick={handleLogout}>
                      Yes
                    </Link>
                    {/* 🔹 Cancel logout */}
                    <Link
                      to="#"
                      className="active"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      No
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
