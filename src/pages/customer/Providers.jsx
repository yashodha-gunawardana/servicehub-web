import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/api/providers");
        setProviders(response.data);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
        setError("Unable to load service providers.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-50 text-green-700 border-green-200";
      case "UNAVAILABLE":
        return "bg-slate-50 text-slate-600 border-slate-200";
      case "BUSY":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading service providers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

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

          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Service Providers
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Browse available providers for your service needs.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* No Providers */}
        {!error && providers.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">
            <p className="text-sm text-slate-500">
              No service providers available.
            </p>
          </div>
        )}

        {/* Provider Cards */}
        {!error && providers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {provider.name?.charAt(0)?.toUpperCase() || "P"}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {provider.name}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${getStatusStyle(
                      provider.status
                    )}`}
                  >
                    {provider.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-sm text-slate-600">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Providers;