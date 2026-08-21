import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/users/login", formData);

      const user = response.data;

      console.log("Login successful:", user);

      // Save logged-in user
      localStorage.setItem("user", JSON.stringify(user));

      // Role-based navigation
      if (user.role === "CUSTOMER") {
        navigate("/customer/dashboard");
      } else if (user.role === "PROVIDER") {
        navigate("/provider/dashboard");
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        setError("Unknown user role.");
      }

    } catch (err) {
      console.error("Login error:", err);

        setError(
            err.response?.data?.message ||
            (typeof err.response?.data === "string"
            ? err.response.data
            : "Invalid email or password.")
        );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>ServiceHub Login</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="email">Email</label>

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

        <div>
          <label htmlFor="password">Password</label>

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

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;