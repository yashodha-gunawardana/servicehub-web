import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function ProviderDashboard() {
  const [requests, setRequests] = useState([]);
  const [provider, setProvider] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchProviderRequests();
  }, []);

  // ==========================================
  // Fetch Provider + Assigned Requests
  // ==========================================
  const fetchProviderRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.email) {
        setError("Please login again.");
        return;
      }

      // Get all providers
      const providerResponse = await api.get("/api/providers");

      const providers = providerResponse.data;

      // Find current provider by email
      const currentProvider = providers.find(
        (provider) => provider.email === user.email
      );

      if (!currentProvider) {
        setError("Provider profile not found.");
        return;
      }

      setProvider(currentProvider);

      // Get requests assigned to provider
      const requestResponse = await api.get(
        `/api/requests/provider/${currentProvider.id}`
      );

      setRequests(requestResponse.data);
    } catch (err) {
      console.error("Failed to fetch provider requests:", err);

      setError("Failed to load service requests.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Update Request Status
  // ==========================================
  const updateRequestStatus = async (request, newStatus) => {
    try {
      setError("");
      setUpdatingId(request.id);

      await api.put(`/api/requests/${request.id}`, {
        customerId: request.customerId,
        serviceType: request.serviceType,
        description: request.description,
        location: request.location,
        providerId: request.providerId,
        status: newStatus,
      });

      // Refresh requests
      await fetchProviderRequests();
    } catch (err) {
      console.error("Failed to update request status:", err);

      console.error("Backend response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to update request status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // Logout
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

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
              Provider Dashboard
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Back */}
        {/* <p>
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </p> */}

        {/* ==========================================
            Provider Information
        ========================================== */}
        {provider && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                {provider.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Welcome, {provider.name}
                </h2>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusStyle(
                    provider.status
                  )}`}
                >
                  {provider.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <p>
                <span className="font-medium text-slate-700">Email:</span> {provider.email}
              </p>
              <p>
                <span className="font-medium text-slate-700">Phone:</span> {provider.phone}
              </p>
              <p>
                <span className="font-medium text-slate-700">Service:</span> {provider.serviceType}
              </p>
              <p>
                <span className="font-medium text-slate-700">Location:</span> {provider.location}
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
            <p className="text-sm text-slate-500">Loading service requests...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* No Requests */}
        {!loading && !error && requests.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              No Service Requests
            </h2>
            <p className="text-sm text-slate-500">
              You currently have no assigned service requests.
            </p>
          </div>
        )}

        {/* Requests */}
        {!loading && !error && requests.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              My Service Requests
            </h2>

            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-bold text-slate-900 text-sm">
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

                  <div className="space-y-1 text-sm text-slate-600 mb-4">
                    <p>
                      <span className="font-medium text-slate-700">Description:</span>{" "}
                      {request.description}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">Customer ID:</span>{" "}
                      {request.customerId}
                    </p>
                    <p>
                      <span className="font-medium text-slate-700">Location:</span>{" "}
                      {request.location}
                    </p>
                  </div>

                  {/* ==================================
                      PENDING → ACCEPTED
                  ================================== */}
                  {request.status === "PENDING" && (
                    <button
                      disabled={updatingId === request.id}
                      onClick={() => updateRequestStatus(request, "ACCEPTED")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
                    >
                      {updatingId === request.id ? "Accepting..." : "Accept Request"}
                    </button>
                  )}

                  {/* ==================================
                      ACCEPTED → IN_PROGRESS
                  ================================== */}
                  {request.status === "ACCEPTED" && (
                    <button
                      disabled={updatingId === request.id}
                      onClick={() => updateRequestStatus(request, "IN_PROGRESS")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm shadow-purple-500/20 transition-colors"
                    >
                      {updatingId === request.id ? "Starting..." : "Start Service"}
                    </button>
                  )}

                  {/* ==================================
                      IN_PROGRESS → COMPLETED
                  ================================== */}
                  {request.status === "IN_PROGRESS" && (
                    <button
                      disabled={updatingId === request.id}
                      onClick={() => updateRequestStatus(request, "COMPLETED")}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm shadow-green-500/20 transition-colors"
                    >
                      {updatingId === request.id ? "Completing..." : "Complete Service"}
                    </button>
                  )}

                  {/* ==================================
                      COMPLETED
                  ================================== */}
                  {request.status === "COMPLETED" && (
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Service Completed
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default ProviderDashboard;