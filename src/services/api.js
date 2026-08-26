import axios from "axios";

const api = axios.create({
  baseURL: "http://34.180.36.86"
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // }
});

export default api;