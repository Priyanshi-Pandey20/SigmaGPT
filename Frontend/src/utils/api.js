const BASE_URL = "https://sigmagpt-backend-4ldy.onrender.com";

export const apiFetch = (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
};