const BASE_URL = "http://localhost:8080/api";

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