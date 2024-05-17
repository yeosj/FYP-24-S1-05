import axios from "axios";

const instance = axios.create({
  baseURL: "https://your.api.url",
});

instance.interceptors.request.use((request) => {
  console.log("Starting Request", JSON.stringify(request, null, 2));
  return request;
});

instance.interceptors.response.use((response) => {
  console.log("Response:", JSON.stringify(response, null, 2));
  return response;
});

export default instance;
