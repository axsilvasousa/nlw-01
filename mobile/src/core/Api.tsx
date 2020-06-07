import axios from "axios";
import { baseURL } from "./Constants";
const api = axios.create({
  baseURL,
});

export default api;
