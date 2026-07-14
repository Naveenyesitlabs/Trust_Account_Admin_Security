import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";
import Sidebar from "./component/Sidebar";
import useSubscriptionBlocker from "./hooks/useSubscriptionBlocker";
import AssignRole from "./pages/AssignRole";
import ClientLedger from "./pages/ClientLedger";
import CreateNewRole from "./pages/CreateNewRole";
import GetJournal from "./pages/GetJournal";
import GetLedger from "./pages/GetLedger";
import JournalEntry from "./pages/JournalEntry";
import Login from "./pages/Login";
import ManageClientTrustAccount from "./pages/ManageClientTrustAccount";
import ManageUser from "./pages/ManageUser";
import ViewAssignedRoles from "./pages/ViewAssignedRoles";

function App() {
  useSubscriptionBlocker();
  const location = useLocation();
  const [restrictSidebar, setRestrictSidebar] = useState(
    location.pathname == "/"
  );
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setRestrictSidebar(location.pathname === "/");
  }, [location.pathname]);

  return (
    <>
      {!restrictSidebar && <Sidebar showSidebar={showSidebar} />}
      <section id={!restrictSidebar ? "content" : undefined}>
        {!restrictSidebar && (
          <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        )}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/manage-user"
            element={<ProtectedRoute allowedRoles={["admin"]}><ManageUser /></ProtectedRoute>}
          />
          <Route
            path="/create-role"
            element={<ProtectedRoute allowedRoles={["admin"]}><CreateNewRole /></ProtectedRoute>}
          />
          <Route
            path="/assign-role"
            element={<ProtectedRoute allowedRoles={["admin"]}><AssignRole /></ProtectedRoute>}
          />
          <Route
            path="/view-assign-role"
            element={<ProtectedRoute allowedRoles={["admin"]}><ViewAssignedRoles /></ProtectedRoute>}
          />
          <Route
            path="/manage-clients-trust-accounts"
            element={<ProtectedRoute allowedRoles={["admin"]}><ManageClientTrustAccount /></ProtectedRoute>}
          />
          <Route
            path="/journal-entry"
            element={<ProtectedRoute allowedRoles={["admin"]}><JournalEntry /></ProtectedRoute>}
          />
          <Route
            path="/journal-entry/get-journal"
            element={<ProtectedRoute allowedRoles={["admin"]}><GetJournal /></ProtectedRoute>}
          />
          <Route
            path="/client-ledger"
            element={<ProtectedRoute allowedRoles={["admin"]}><ClientLedger /></ProtectedRoute>}
          />
          <Route
            path="/client-ledger/get-ledger"
            element={<ProtectedRoute allowedRoles={["admin"]}><GetLedger /></ProtectedRoute>}
          />
        </Routes>
      </section>
    </>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
