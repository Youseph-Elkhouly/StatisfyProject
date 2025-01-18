import axios from "axios";

export const authenticate = () => {
  window.location.href = "http://localhost:3004/auth";
};

export const fetchEmails = async () => {
  try {
    const response = await axios.get("http://localhost:3004/fetch-emails");
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
};
