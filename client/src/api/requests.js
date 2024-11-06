import axios from "axios";
import Cookies from "js-cookie";
const API_BASE_URL = "http://localhost:4000/req";
const getHeaders = () => {
  const token = Cookies.get("authToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Incluye el token si existe
  };
};

export const sendRequest = async (data) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    console.log(data);
    return response.data;
  } catch (error) {
    console.error("Error sending request:", error);
    throw error.response?.data || error;
  }
};

export const getAllRequests = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      // Handle HTTP errors
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("These are the requests", data);
    return data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    throw error.response?.data || error;
  }
};

export const acceptRequest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "POST",
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error accepting request:", error);
    throw error.response?.data || error;
  }
};

export const denyRequest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error denying request:", error);
    throw error.response?.data || error;
  }
};
