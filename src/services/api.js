import axios from "axios";

const api = axios.create({
  baseURL: "http://136.83.128.227:8080",
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // }
});

export default api;