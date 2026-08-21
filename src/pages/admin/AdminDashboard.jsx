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

  return (
    <div>
      {/* ==========================================
          Header
      ========================================== */}
      <header>
        <h1>ServiceHub Admin Dashboard</h1>

        <button onClick={handleLogout}>
          Logout
        </button>
      </header>

      <hr />

      {/* ==========================================
          Dashboard Statistics
      ========================================== */}
      <section>
        <h2>Dashboard Overview</h2>

        <div>
          <div>
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>

          <div>
            <h3>Customers</h3>
            <p>{totalCustomers}</p>
          </div>

          <div>
            <h3>Providers</h3>
            <p>{totalProviders}</p>
          </div>

          <div>
            <h3>Total Requests</h3>
            <p>{totalRequests}</p>
          </div>
        </div>
      </section>

      <hr />

      {/* ==========================================
          All Users
      ========================================== */}
      <section>
        <h2>All Users</h2>

        {loadingUsers && (
          <p>Loading users...</p>
        )}

        {!loadingUsers && users.length === 0 && (
          <p>No users found.</p>
        )}

        {!loadingUsers && users.length > 0 && (
          <div>
            {users.map((user) => (
              <div key={user.id}>
                <h3>{user.name}</h3>

                <p>
                  <strong>ID:</strong>{" "}
                  {user.id}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {user.email}
                </p>

                <p>
                  <strong>Role:</strong>{" "}
                  {user.role}
                </p>

                <hr />
              </div>
            ))}
          </div>
        )}
      </section>

      <hr />

      {/* ==========================================
          All Providers
      ========================================== */}
      <section>
        <h2>All Service Providers</h2>

        {loadingProviders && (
          <p>Loading providers...</p>
        )}

        {!loadingProviders &&
          providers.length === 0 && (
            <p>No providers found.</p>
          )}

        {!loadingProviders &&
          providers.length > 0 && (
            <div>
              {providers.map((provider) => (
                <div key={provider.id}>
                  <h3>{provider.name}</h3>

                  <p>
                    <strong>ID:</strong>{" "}
                    {provider.id}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {provider.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {provider.phone}
                  </p>

                  <p>
                    <strong>Service:</strong>{" "}
                    {provider.serviceType}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {provider.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {provider.status}
                  </p>

                  <hr />
                </div>
              ))}
            </div>
          )}
      </section>

      <hr />

      {/* ==========================================
          All Service Requests
      ========================================== */}
      <section>
        <h2>All Service Requests</h2>

        {loadingRequests && (
          <p>Loading service requests...</p>
        )}

        {!loadingRequests &&
          requests.length === 0 && (
            <p>No service requests found.</p>
          )}

        {!loadingRequests &&
          requests.length > 0 && (
            <div>
              {requests.map((request) => (
                <div key={request.id}>
                  <h3>
                    {request.serviceType}
                  </h3>

                  <p>
                    <strong>Request ID:</strong>{" "}
                    {request.id}
                  </p>

                  <p>
                    <strong>Description:</strong>{" "}
                    {request.description}
                  </p>

                  <p>
                    <strong>Customer ID:</strong>{" "}
                    {request.customerId}
                  </p>

                  <p>
                    <strong>Provider ID:</strong>{" "}
                    {request.providerId ||
                      "Not assigned"}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {request.location}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {request.status}
                  </p>

                  <hr />
                </div>
              ))}
            </div>
          )}
      </section>

      {/* ==========================================
          Error
      ========================================== */}
      {error && (
        <p>{error}</p>
      )}
    </div>
  );
}

export default AdminDashboard;