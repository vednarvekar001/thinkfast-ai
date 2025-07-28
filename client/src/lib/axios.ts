import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8114/api", // your backend
  withCredentials: true,
});

export default instance;
