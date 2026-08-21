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

  return (
    <div>
      <h1>My Service Requests</h1>

      {/* Back */}
      <p>
        <Link to="/customer/dashboard">
          Back to Dashboard
        </Link>
      </p>

      {/* Loading */}
      {loading && (
        <p>Loading requests...</p>
      )}

      {/* Error */}
      {error && (
        <p>{error}</p>
      )}

      {/* No Requests */}
      {!loading &&
        !error &&
        requests.length === 0 && (
          <div>
            <h2>No Service Requests</h2>

            <p>
              You have no service requests yet.
            </p>

            <Link to="/customer/request-service">
              Request a Service
            </Link>
          </div>
        )}

      {/* Requests */}
      {!loading &&
        !error &&
        requests.length > 0 && (
          <div>
            {requests.map((request) => {
              const provider =
                providers[request.providerId];

              return (
                <div key={request.id}>
                  {/* Service */}
                  <h2>
                    {request.serviceType}
                  </h2>

                  {/* Description */}
                  <p>
                    <strong>
                      Description:
                    </strong>{" "}
                    {request.description}
                  </p>

                  {/* Location */}
                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {request.location}
                  </p>

                  {/* Status */}
                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {request.status}
                  </p>

                  {/* Status Message */}
                  <p>
                    {getStatusMessage(
                      request.status
                    )}
                  </p>

                  {/* Provider */}
                  {provider ? (
                    <div>
                      <h3>
                        Provider Details
                      </h3>

                      <p>
                        <strong>
                          Name:
                        </strong>{" "}
                        {provider.name}
                      </p>

                      <p>
                        <strong>
                          Email:
                        </strong>{" "}
                        {provider.email}
                      </p>

                      <p>
                        <strong>
                          Phone:
                        </strong>{" "}
                        {provider.phone}
                      </p>

                      <p>
                        <strong>
                          Service:
                        </strong>{" "}
                        {provider.serviceType}
                      </p>

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {provider.location}
                      </p>

                      <p>
                        <strong>
                          Provider Status:
                        </strong>{" "}
                        {provider.status}
                      </p>
                    </div>
                  ) : (
                    <p>
                      <strong>
                        Provider:
                      </strong>{" "}
                      Provider details unavailable.
                    </p>
                  )}

                  <hr />
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}

export default MyRequests;