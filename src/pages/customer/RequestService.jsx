import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function RequestService() {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    serviceType: "",
    description: "",
    location: "",
    providerId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get("/api/providers");

        const availableProviders = response.data.filter(
          (provider) => provider.status === "AVAILABLE"
        );

        setProviders(availableProviders);
      } catch (err) {
        console.error("Provider loading error:", err);
        setError("Unable to load service providers.");
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        setError("Please login first.");
        navigate("/login");
        return;
      }

      const requestData = {
        customerId: String(user.id),
        serviceType: formData.serviceType,
        description: formData.description,
        location: formData.location,
        providerId: formData.providerId,
      };

      const response = await api.post("/api/requests", requestData);

      console.log("Request created:", response.data);

      setSuccess("Service request created successfully!");

      setFormData({
        serviceType: "",
        description: "",
        location: "",
        providerId: "",
      });

    } catch (err) {
      console.error("Request creation error:", err);

      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to create service request.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ServiceHub</h1>

      <Link to="/customer/dashboard">
        <button>Back to Dashboard</button>
      </Link>

      <h2>Request a Service</h2>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="serviceType">
            Service Type
          </label>

          <select
            id="serviceType"
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            required
          >
            <option value="">Select service</option>
            <option value="PLUMBING">Plumbing</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="CLEANING">Cleaning</option>
            <option value="AC_REPAIR">AC Repair</option>
            <option value="CARPENTRY">Carpentry</option>
            <option value="PAINTING">Painting</option>
            <option value="GARDENING">Gardening</option>
          </select>
        </div>

        <div>
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the service you need"
            rows="5"
            required
          />
        </div>

        <div>
          <label htmlFor="location">
            Location
          </label>

          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter service location"
            required
          />
        </div>

        <div>
          <label htmlFor="providerId">
            Select Provider
          </label>

          {loadingProviders ? (
            <p>Loading providers...</p>
          ) : (
            <select
              id="providerId"
              name="providerId"
              value={formData.providerId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select a provider
              </option>

              {providers.map((provider) => (
                <option
                  key={provider.id}
                  value={provider.id}
                >
                  {provider.name} - {provider.serviceType} -{" "}
                  {provider.location}
                </option>
              ))}
            </select>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </button>

      </form>
    </div>
  );
}

export default RequestService;