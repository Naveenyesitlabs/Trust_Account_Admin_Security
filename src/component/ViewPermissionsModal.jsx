
// 🔹 ViewPermissionsModal
// Props:
// • user → object containing user info and assigned permissions
const ViewPermissionsModal = ({ user }) => {
  // 🔹 Return null if no user is provided
  if (!user) return null;

  // 🔹 Helper function to format permission object into readable strings
  const formatPermissions = (permObj) => {
    const perms = [];
    if (permObj.has_read_permission) perms.push("Read");
    if (permObj.has_add_permission) perms.push("Add");
    if (permObj.has_edit_permission) perms.push("Edit");
    if (permObj.has_delete_permission) perms.push("Delete");
    return perms;
  };

  return (
    <div
      className="modal fade ad-popwrp"
      id="viewPermissions"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="viewPermissions"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* 🔹 Close button */}
          <button
            type="button"
            className="close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">
              <img src="./images/close-icon.svg" alt="Icon" />
            </span>
          </button>

          {/* 🔹 Modal body */}
          <div className="modal-body">
            <div className="cmn-pop-inr-content-wrp">
              {/* 🔹 Header with user info */}
              <div className="sec-head head-center">
                <h2 className="h1-title">Assigned Permissions</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {/* 🔹 Display username */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <strong style={{ width: "100px" }}>User:</strong>
                    <span>{user.user_name}</span>
                  </div>
                  {/* 🔹 Display role */}
                  <div style={{ display: "flex", gap: "10px" }}>
                    <strong style={{ width: "100px" }}>Role:</strong>
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>

              {/* 🔹 Permissions cards wrapper */}
              <div className="pop-assigned-permission-cards-wrp">
                <div
                  className="pop-assigned-permission-card student-panel-permissions"
                  style={{ width: "100%" }}
                >
                  <h3 className="h5-title">Permissions</h3>
                  <div className="permissions-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Menus</th>
                          <th>Permissions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 🔹 Check if user has assigned permissions */}
                        {user.assigned_permissions &&
                          user.assigned_permissions.length > 0 ? (
                          // 🔹 Flatten all module permissions into table rows
                          user.assigned_permissions.flatMap((mod, modIndex) =>
                            mod.permissions.map((perm, i) => {
                              const perms = formatPermissions(perm);
                              return (
                                <tr key={`${modIndex}-${i}`}>
                                  <td>{perm.menu_name || "-"}</td>
                                  <td>
                                    <div className="each-permisions-wrp">
                                      {/* 🔹 Display formatted permissions */}
                                      {perms.length > 0 ? (
                                        perms.map((label, j) => (
                                          <span
                                            key={j}
                                            className="each-permision"
                                            style={{ marginRight: "10px" }}
                                          >
                                            {label}
                                          </span>
                                        ))
                                      ) : (
                                        <span>No permissions</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )
                        ) : (
                          // 🔹 No permissions fallback
                          <tr>
                            <td colSpan="2" style={{ textAlign: "center" }}>
                              No assigned permissions
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* 🔹 End of permissions cards */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPermissionsModal;
