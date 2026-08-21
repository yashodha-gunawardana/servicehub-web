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

  return (
    <div>
      {/* ==========================================
          Header
      ========================================== */}
      <header>
        <h1>ServiceHub</h1>

        <div>
          <span>
            Welcome, {user?.name || "Customer"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <hr />

      {/* ==========================================
          Main Dashboard
      ========================================== */}
      <main>
        <h2>Customer Dashboard</h2>

        <p>
          Find trusted service providers and request
          services easily.
        </p>

        {/* ==========================================
            Actions
        ========================================== */}
        <div>
          <Link to="/customer/providers">
            <button>
              Find Service Providers
            </button>
          </Link>

          <Link to="/customer/requests">
            <button>
              My Service Requests
            </button>
          </Link>

          <Link to="/customer/request-service">
            <button>
              Request a Service
            </button>
          </Link>
        </div>

        <hr />

        {/* ==========================================
            My Requests
        ========================================== */}
        <section>
          <h2>My Recent Service Requests</h2>

          {loading && (
            <p>Loading your requests...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading &&
            !error &&
            requests.length === 0 && (
              <div>
                <p>
                  You haven't created any service
                  requests yet.
                </p>

                <Link to="/customer/request-service">
                  <button>
                    Request a Service
                  </button>
                </Link>
              </div>
            )}

          {!loading &&
            !error &&
            requests.length > 0 && (
              <div>
                {requests.map((request) => (
                  <div key={request.id}>
                    <h3>
                      {request.serviceType}
                    </h3>

                    <p>
                      <strong>Description:</strong>{" "}
                      {request.description}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {request.location}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {request.status}
                    </p>

                    <p>
                      {getStatusMessage(
                        request.status
                      )}
                    </p>

                    {request.providerId && (
                      <p>
                        <strong>
                          Provider ID:
                        </strong>{" "}
                        {request.providerId}
                      </p>
                    )}

                    <hr />
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