import { Navigate, useLocation } from "react-router-dom";
import { getStoredSession } from "../utils/authStorage";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const session = getStoredSession();
  const normalizedRole = session?.role?.toLowerCase();

  if (!normalizedRole) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
