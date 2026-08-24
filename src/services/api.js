import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "http://34.100.145.66:8080",
  headers: {
    "Content-Type": "multipart/form-data",
  }
});

export default api;