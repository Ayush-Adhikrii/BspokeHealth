import axios from "axios";
import { getCookie, removeCookie } from "./cookie";

const API = axios.create({
  baseURL: "https://localhost:3000/api",
  timeout: 10000, // 10 second timeout
});

let csrfToken = null;
let csrfTokenPromise = null;

const fetchCSRFToken = async () => {
  try {
    const response = await axios.get("https://localhost:3000/api/csrf-token", {
      withCredentials: true,
      timeout: 5000 // 5 second timeout
    });
    csrfToken = response.data.csrfToken;
    console.log("CSRF token fetched:", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
    // Don't throw error, just return null
    return null;
  }
};

// Only fetch CSRF token if we're not already fetching
if (!csrfTokenPromise) {
  csrfTokenPromise = fetchCSRFToken();
}

API.interceptors.request.use(
  async (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Only try to get CSRF token for non-auth routes
    if (!config.url?.includes('/auth/') && !config.url?.includes('/csrf-token')) {
      if (!csrfToken && csrfTokenPromise) {
        try {
          await csrfTokenPromise;
        } catch (error) {
          console.warn("CSRF token fetch failed, continuing without it");
        }
      }
      
      if (csrfToken && config.method !== 'get') {
        config.headers["X-CSRF-Token"] = csrfToken;
        console.log("Adding CSRF token to request:", config.url);
      }
    }
    
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('Network error - Backend server might not be running');
      console.error('Please ensure the backend server is running on https://localhost:3000');
      return Promise.reject(new Error('Backend server is not accessible. Please check if the server is running.'));
    }
    
    if (error.response && error.response.status === 401) {
      removeCookie("token");
      window.location.href = "/login";
    }
    
    if (error.response && error.response.status === 403 && 
        error.response.data?.error === 'CSRF token validation failed') {
      console.log("CSRF token invalid, fetching new token and retrying...");
      
      // Reset the promise and fetch new token
      csrfTokenPromise = fetchCSRFToken();
      try {
        await csrfTokenPromise;
        
        if (csrfToken) {
          const originalRequest = error.config;
          originalRequest.headers["X-CSRF-Token"] = csrfToken;
          console.log("Retrying request with new CSRF token:", originalRequest.url);
          return API(originalRequest);
        }
      } catch (retryError) {
        console.error("Failed to retry with new CSRF token:", retryError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;
