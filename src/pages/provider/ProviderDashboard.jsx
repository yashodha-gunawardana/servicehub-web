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

  return (
    <div>
      <h1>Provider Dashboard</h1>

      {/* ==========================================
          Provider Information
      ========================================== */}
      {provider && (
        <div>
          <h2>Welcome, {provider.name}</h2>

          <p>
            <strong>Email:</strong> {provider.email}
          </p>

          <p>
            <strong>Phone:</strong> {provider.phone}
          </p>

          <p>
            <strong>Service:</strong> {provider.serviceType}
          </p>

          <p>
            <strong>Location:</strong> {provider.location}
          </p>

          <p>
            <strong>Status:</strong> {provider.status}
          </p>
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout}>Logout</button>

      <hr />

      {/* Loading */}
      {loading && <p>Loading service requests...</p>}

      {/* Error */}
      {error && <p>{error}</p>}

      {/* No Requests */}
      {!loading && !error && requests.length === 0 && (
        <div>
          <h2>No Service Requests</h2>

          <p>
            You currently have no assigned service requests.
          </p>
        </div>
      )}

      {/* Requests */}
      {!loading && !error && requests.length > 0 && (
        <div>
          <h2>My Service Requests</h2>

          {requests.map((request) => (
            <div key={request.id}>
              <h3>{request.serviceType}</h3>

              <p>
                <strong>Description:</strong>{" "}
                {request.description}
              </p>

              <p>
                <strong>Customer ID:</strong>{" "}
                {request.customerId}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {request.location}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {request.status}
              </p>

              {/* ==================================
                  PENDING → ACCEPTED
              ================================== */}
              {request.status === "PENDING" && (
                <button
                  disabled={updatingId === request.id}
                  onClick={() =>
                    updateRequestStatus(
                      request,
                      "ACCEPTED"
                    )
                  }
                >
                  {updatingId === request.id
                    ? "Accepting..."
                    : "Accept Request"}
                </button>
              )}

              {/* ==================================
                  ACCEPTED → IN_PROGRESS
              ================================== */}
              {request.status === "ACCEPTED" && (
                <button
                  disabled={updatingId === request.id}
                  onClick={() =>
                    updateRequestStatus(
                      request,
                      "IN_PROGRESS"
                    )
                  }
                >
                  {updatingId === request.id
                    ? "Starting..."
                    : "Start Service"}
                </button>
              )}

              {/* ==================================
                  IN_PROGRESS → COMPLETED
              ================================== */}
              {request.status === "IN_PROGRESS" && (
                <button
                  disabled={updatingId === request.id}
                  onClick={() =>
                    updateRequestStatus(
                      request,
                      "COMPLETED"
                    )
                  }
                >
                  {updatingId === request.id
                    ? "Completing..."
                    : "Complete Service"}
                </button>
              )}

              {/* ==================================
                  COMPLETED
              ================================== */}
              {request.status === "COMPLETED" && (
                <p>
                  <strong>✓ Service Completed</strong>
                </p>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}

      {/* Back */}
      <p>
        <Link to="/customer/dashboard">
          Back to Dashboard
        </Link>
      </p>
    </div>
  );
}

export default ProviderDashboard;