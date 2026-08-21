import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Providers from "./pages/customer/Providers";
import RequestService from "./pages/customer/RequestService";
import MyRequests from "./pages/customer/MyRequests";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/customer/dashboard"
          element={<CustomerDashboard />}
        />

        <Route
          path="/customer/providers"
          element={<Providers />}
        />

        <Route
          path="/provider/dashboard"
          element={<ProviderDashboard />}
        />

        <Route
          path="/customer/request-service"
          element={<RequestService />}
        />

        <Route
          path="/customer/requests"
          element={<MyRequests />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;