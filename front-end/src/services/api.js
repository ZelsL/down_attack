import axios from "axios";

axios.defaults.withCredentials = true;

let baseURL = "https://" + process.env.VUE_APP_BACK_END_URL;
if (process.env.NODE_ENV === "development") {
  baseURL = "http://" + process.env.VUE_APP_BACK_END_URL;
}

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default apiClient;
