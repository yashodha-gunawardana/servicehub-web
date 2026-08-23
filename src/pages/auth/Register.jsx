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
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">

        {/* Header section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ServiceHub Register
          </h1>
          <p className="text-sm text-slate-500">
            Create an account to get started.
          </p>
        </div>

        {/* Error message block */}
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Success message block */}
        {success && (
          <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl border border-green-200 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Form elements */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Register As
            </label>
            <select
              id="role"
              value={role}
              onChange={handleRoleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50 focus:bg-white outline-none text-sm"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Service Provider</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
            />
          </div>

          {/* Provider Fields */}
          {role === "PROVIDER" && (
            <>
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
                />
              </div>

              {/* Service Type */}
              <div>
                <label htmlFor="serviceType" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Service Type
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 bg-slate-50/50 focus:bg-white outline-none text-sm"
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

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white outline-none text-sm"
                />
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registering...</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Footer login link */}
        <p className="text-center text-sm text-slate-600 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;