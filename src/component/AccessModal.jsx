import { useDispatch } from "react-redux";
import { changeAccess, getAllUsers } from "../redux/slices/adminSlice";
import { getStoredSession } from "../utils/authStorage";

// AccessModal component - handles granting/denying user access
// Props: updateStatus (contains user id and new access status)
const AccessModal = (updateStatus) => {
  const dispatch = useDispatch();

  // Extract new status and user id from props safely
  const newStatus = updateStatus?.updateStatus?.access;
  const id = updateStatus?.updateStatus?.id;

  // Fetch logged-in admin details from localStorage
  const admin = getStoredSession();
  const admin_id = admin?.user?.userid || 0; // fallback to 0 if missing

  // Function: Handles updating user access status and refreshing user list
  const handleUpdateStatus = async () => {
    // Dispatch Redux action to update access
    await dispatch(changeAccess({ id: id, access_status: newStatus }));

    // Refresh all users for the current admin
    await dispatch(getAllUsers({ admin_id }));
  };

  return (
    <>
      {/* Modal wrapper for access confirmation */}
      <div
        className="modal animate__animated animate__bounceIn my-popup"
        id="suspend-pop"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
      >
        <div className="modal-dialog modal-dialog-edit" role="document">
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
                  <img src="images/fill-cross-pop.svg" alt="close" />
                </span>
              </button>
            </div>

            {/* Modal body - confirmation UI */}
            <div className="modal-body">
              <div className="delete-pop-wrap">
                <form>
                  <div className="delete-pop-inner">
                    {/* Show icon depending on access status */}
                    <img
                      src={
                        newStatus === "granted"
                          ? "images/active-pop.svg"
                          : "images/suspend-pop.svg"
                      }
                      alt="status-icon"
                    />

                    {/* Confirmation text */}
                    <p>
                      Are you sure you want to{" "}
                      {newStatus === "granted" ? "Grant" : "Deny"}
                      <br />
                      {newStatus === "granted" ? "grant" : "denied"} Access?
                    </p>
                  </div>

                  {/* Action buttons: Cancel / Confirm */}
                  <div className="delete-pop-btn">
                    {/* Cancel button - only closes modal */}
                    <a
                      href="#"
                      className="active"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Cancel
                    </a>

                    {/* Confirm button - updates status then closes modal */}
                    <a
                      href="#"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => handleUpdateStatus()}
                    >
                      Yes
                    </a>
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

export default AccessModal;
