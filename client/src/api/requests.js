import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:4000/req";
const getHeaders = () => {
  const token = Cookies.get("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Send a new request
export const sendRequest = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
};

// Fetch all requests (admin only)
export const getAllRequests = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("Fetched requests:", data);
    return data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error;
  }
};

// Accept a request and create a publication
export const acceptRequest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error;
  }
};

// Deny a request
export const denyRequest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error denying request:", error);
    throw error;
  }
};
