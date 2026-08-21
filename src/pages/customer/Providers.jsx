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

  if (loading) {
    return <p>Loading service providers...</p>;
  }

  return (
    <div>
      <h1>ServiceHub</h1>

      <Link to="/customer/dashboard">
        <button>Back to Dashboard</button>
      </Link>

      <h2>Service Providers</h2>

      {error && <p>{error}</p>}

      {!error && providers.length === 0 && (
        <p>No service providers available.</p>
      )}

      {providers.map((provider) => (
        <div key={provider.id}>
          <h3>{provider.name}</h3>

          <p>Email: {provider.email}</p>
          <p>Phone: {provider.phone}</p>
          <p>Service: {provider.serviceType}</p>
          <p>Location: {provider.location}</p>
          <p>Status: {provider.status}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Providers;