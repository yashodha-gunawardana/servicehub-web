import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [providers, setProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  // ==========================================
  // Fetch Customer Requests
  // ==========================================
  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || !user.id) {
        setError("Please login again.");
        return;
      }

      // Get customer requests
      const response = await api.get(
        `/api/requests/customer/${user.id}`
      );

      const requestData = response.data;

      setRequests(requestData);

      // ==========================================
      // Get Provider Details
      // ==========================================
      const providerData = {};

      await Promise.all(
        requestData
          .filter(
            (request) =>
              request.providerId &&
              request.providerId.trim() !== ""
          )
          .map(async (request) => {
            try {
              const providerResponse = await api.get(
                `/api/requests/provider-details/${request.providerId}`
              );

              providerData[request.providerId] =
                providerResponse.data;

            } catch (err) {
              console.error(
                `Failed to load provider ${request.providerId}:`,
                err
              );
            }
          })
      );

      setProviders(providerData);

    } catch (err) {
      console.error(
        "Failed to fetch requests:",
        err
      );

      setError(
        "Failed to load service requests."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Status Message
  // ==========================================
  const getStatusMessage = (status) => {
    switch (status) {
      case "PENDING":
        return "Waiting for provider to accept your request.";

      case "ACCEPTED":
        return "Your request has been accepted by the provider.";

      case "COMPLETED":
        return "Your service has been completed.";

      default:
        return "";
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Header */}
        <div>
          <Link
            to="/customer/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Service Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track the status of your requested services.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
            <p className="text-sm text-slate-500">Loading requests...</p>
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
            <p className="text-sm text-slate-500 mb-5">
              You have no service requests yet.
            </p>
            <Link to="/customer/request-service">
              <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-colors">
                Request a Service
              </button>
            </Link>
          </div>
        )}

        {/* Requests */}
        {!loading && !error && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => {
              const provider = providers[request.providerId];

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
                >
                  {/* Service + Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {request.serviceType}
                    </h2>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${getStatusStyle(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Description:</span>{" "}
                    {request.description}
                  </p>

                  {/* Location */}
                  <p className="text-sm text-slate-600 mb-1">
                    <span className="font-medium text-slate-700">Location:</span>{" "}
                    {request.location}
                  </p>

                  {/* Status Message */}
                  <p className="text-sm text-slate-500 mb-4">
                    {getStatusMessage(request.status)}
                  </p>

                  {/* Provider */}
                  {provider ? (
                    <div className="border-t border-slate-100 pt-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">
                        Provider Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium text-slate-700">Name:</span>{" "}
                          {provider.name}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Email:</span>{" "}
                          {provider.email}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Phone:</span>{" "}
                          {provider.phone}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Service:</span>{" "}
                          {provider.serviceType}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Location:</span>{" "}
                          {provider.location}
                        </p>
                        <p>
                          <span className="font-medium text-slate-700">Provider Status:</span>{" "}
                          {provider.status}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 pt-4">
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-700">Provider:</span>{" "}
                        Provider details unavailable.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests;