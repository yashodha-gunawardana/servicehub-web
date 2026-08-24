import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function CustomerDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!loggedUser || !loggedUser.id) {
      navigate("/login");
      return;
    }

    setUser(loggedUser);

    fetchRequests(loggedUser.id);
  }, [navigate]);

  // ==========================================
  // Get Customer Requests
  // ==========================================
  const fetchRequests = async (customerId) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/api/requests/customer/${customerId}`
      );

      setRequests(response.data);

    } catch (err) {
      console.error(
        "Failed to fetch customer requests:",
        err
      );

      setError("Failed to load service requests.");
    } finally {
      setLoading(false);
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
  // Status Display
  // ==========================================
  const getStatusMessage = (status) => {
    switch (status) {
      case "PENDING":
        return "Waiting for provider to accept";

      case "ACCEPTED":
        return "Provider accepted your request";

      case "COMPLETED":
        return "Service completed";

      default:
        return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ACCEPTED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
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
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              ServiceHub
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:inline">
              Welcome, <span className="font-semibold text-slate-900">{user?.name || "Customer"}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ==========================================
          Main Dashboard
      ========================================== */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Find trusted service providers and request services easily.
          </p>
        </div>

        {/* ==========================================
            Actions
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/customer/providers">
            <button className="w-full h-full flex flex-col items-start gap-2 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900 text-sm">Find Service Providers</span>
            </button>
          </Link>

          <Link to="/customer/requests">
            <button className="w-full h-full flex flex-col items-start gap-2 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900 text-sm">My Service Requests</span>
            </button>
          </Link>

          <Link to="/customer/request-service">
            <button className="w-full h-full flex flex-col items-start gap-2 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900 text-sm">Request a Service</span>
            </button>
          </Link>
        </div>

        {/* ==========================================
            My Requests
        ========================================== */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            My Recent Service Requests
          </h2>

          {loading && (
            <p className="text-sm text-slate-500">Loading your requests...</p>
          )}

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && requests.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500 mb-4">
                You haven't created any service requests yet.
              </p>
              <Link to="/customer/request-service">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-colors">
                  Request a Service
                </button>
              </Link>
            </div>
          )}

          {!loading && !error && requests.length > 0 && (
            <div className="space-y-4">
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
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Description:</span>{" "}
                    {request.description}
                  </p>

                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Location:</span>{" "}
                    {request.location}
                  </p>

                  <p className="text-sm text-slate-500 mb-1">
                    {getStatusMessage(request.status)}
                  </p>

                  {request.providerId && (
                    <p className="text-sm text-slate-500">
                      <span className="font-medium text-slate-700">Provider ID:</span>{" "}
                      {request.providerId}
                    </p>
                  )}

                  {request.imageFileName && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Service Image:
                      </p>

                      <img
                        src={`${api.defaults.baseURL}/api/requests/image/${encodeURIComponent(
                          request.imageFileName
                        )}`}
                        alt="Service request"
                        className="w-full max-w-md h-56 object-cover rounded-xl border border-slate-200"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CustomerDashboard;