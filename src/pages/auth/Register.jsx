import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("CUSTOMER");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    serviceType: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (role === "CUSTOMER") {
        // =========================
        // Customer Registration
        // =========================
        await api.post("/api/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "CUSTOMER",
        });
      } else {
        // =========================
        // Provider Registration
        // =========================

        // 1. Create provider login account
        await api.post("/api/users", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "PROVIDER",
        });

        // 2. Create provider profile
        await api.post("/api/providers", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          serviceType: formData.serviceType,
          location: formData.location,
          status: "AVAILABLE",
        });
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ServiceHub Register</h1>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <form onSubmit={handleSubmit}>

        {/* =========================
            Role
        ========================= */}
        <div>
          <label htmlFor="role">
            Register As
          </label>

          <select
            id="role"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="CUSTOMER">
              Customer
            </option>

            <option value="PROVIDER">
              Service Provider
            </option>
          </select>
        </div>

        {/* =========================
            Name
        ========================= */}
        <div>
          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* =========================
            Email
        ========================= */}
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* =========================
            Password
            One password field for
            both Customer & Provider
        ========================= */}
        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {/* =========================
            Provider Fields
        ========================= */}
        {role === "PROVIDER" && (
          <>
            {/* Phone */}
            <div>
              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Service Type */}
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
                <option value="">
                  Select service
                </option>

                <option value="PLUMBING">
                  Plumbing
                </option>

                <option value="ELECTRICAL">
                  Electrical
                </option>

                <option value="CLEANING">
                  Cleaning
                </option>

                <option value="AC_REPAIR">
                  AC Repair
                </option>

                <option value="CARPENTRY">
                  Carpentry
                </option>

                <option value="PAINTING">
                  Painting
                </option>

                <option value="GARDENING">
                  Gardening
                </option>
              </select>
            </div>

            {/* Location */}
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
                placeholder="Enter your location"
                required
              />
            </div>
          </>
        )}

        {/* =========================
            Submit
        ========================= */}
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>

      <p>
        Already have an account?{" "}

        <Link to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;