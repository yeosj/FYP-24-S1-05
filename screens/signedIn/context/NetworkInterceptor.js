import axios from "axios";
import { db } from "../../../Firebase/firebase"; // Import the db from your Firebase configuration file

const http = axios.create({
  // Example baseURL, replace 'https://api.yourdomain.com' with your actual API domain
  baseURL: "https://api.yourdomain.com",
});

// Request Interceptor for logging requests
http.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    // You could also log request details to Firebase here if needed
    return request;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor for logging responses
http.interceptors.response.use(
  (response) => {
    console.log("Response:", response);

    // Prepare log data
    const logData = {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data, // Be cautious with sensitive data
      timestamp: new Date().toISOString(),
    };

    // Log to Firestore
    db.collection("networkLogs")
      .add(logData)
      .then(() => console.log("Data logged to Firebase"))
      .catch((err) => console.error("Error logging data to Firebase:", err));

    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);
