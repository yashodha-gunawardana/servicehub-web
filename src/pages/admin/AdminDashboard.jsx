import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchProviders();
    fetchRequests();
  }, []);

  // ==========================================
  // Fetch Users
  // ==========================================
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/api/users");

      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);

      setError("Failed to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  // ==========================================
  // Fetch Providers
  // ==========================================
  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);

      const response = await api.get("/api/providers");

      setProviders(response.data);
    } catch (err) {
      console.error("Failed to fetch providers:", err);

      setError("Failed to load providers.");
    } finally {
      setLoadingProviders(false);
    }
  };

  // ==========================================
  // Fetch Service Requests
  // ==========================================
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);

      const response = await api.get("/api/requests");

      setRequests(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch service requests:",
        err
      );

      setError("Failed to load service requests.");
    } finally {
      setLoadingRequests(false);
    }
  };

  // ==========================================
  // Logout
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ==========================================
  // Statistics
  // ==========================================
  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (user) => user.role === "CUSTOMER"
  ).length;

  const totalProviders = providers.length;

  const totalRequests = requests.length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ACCEPTED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "IN_PROGRESS":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "AVAILABLE":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-50 text-red-700 border-red-200";
      case "PROVIDER":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CUSTOMER":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {/* ==========================================
          Header
      ========================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              ServiceHub Admin
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Error */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* ==========================================
            Dashboard Statistics
        ========================================== */}
        <section>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-4">
            Dashboard Overview
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Total Users
              </p>
              <p className="text-3xl font-extrabold text-slate-900">{totalUsers}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Customers
              </p>
              <p className="text-3xl font-extrabold text-blue-600">{totalCustomers}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Providers
              </p>
              <p className="text-3xl font-extrabold text-purple-600">{totalProviders}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Total Requests
              </p>
              <p className="text-3xl font-extrabold text-green-600">{totalRequests}</p>
            </div>
          </div>
        </section>

        {/* ==========================================
            All Users
        ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">All Users</h2>

          {loadingUsers && (
            <p className="text-sm text-slate-500">Loading users...</p>
          )}

          {!loadingUsers && users.length === 0 && (
            <p className="text-sm text-slate-500">No users found.</p>
          )}

          {!loadingUsers && users.length > 0 && (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        ID: {user.id} · {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${getRoleStyle(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================================
            All Providers
        ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">All Service Providers</h2>

          {loadingProviders && (
            <p className="text-sm text-slate-500">Loading providers...</p>
          )}

          {!loadingProviders && providers.length === 0 && (
            <p className="text-sm text-slate-500">No providers found.</p>
          )}

          {!loadingProviders && providers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {provider.name}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${getStatusStyle(
                        provider.status
                      )}`}
                    >
                      {provider.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p><span className="font-medium text-slate-700">ID:</span> {provider.id}</p>
                    <p><span className="font-medium text-slate-700">Email:</span> {provider.email}</p>
                    <p><span className="font-medium text-slate-700">Phone:</span> {provider.phone}</p>
                    <p><span className="font-medium text-slate-700">Service:</span> {provider.serviceType}</p>
                    <p><span className="font-medium text-slate-700">Location:</span> {provider.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================================
            All Service Requests
        ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">All Service Requests</h2>

          {loadingRequests && (
            <p className="text-sm text-slate-500">Loading service requests...</p>
          )}

          {!loadingRequests && requests.length === 0 && (
            <p className="text-sm text-slate-500">No service requests found.</p>
          )}

          {!loadingRequests && requests.length > 0 && (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {request.serviceType}
                    </h3>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                    <p><span className="font-medium text-slate-700">Request ID:</span> {request.id}</p>
                    <p><span className="font-medium text-slate-700">Customer ID:</span> {request.customerId}</p>
                    <p><span className="font-medium text-slate-700">Provider ID:</span> {request.providerId || "Not assigned"}</p>
                    <p><span className="font-medium text-slate-700">Location:</span> {request.location}</p>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-medium text-slate-700">Description:</span> {request.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;