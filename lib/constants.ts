const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://dev-portfolio-v5tg.onrender.com"
    : "http://localhost:8000";

export const API_ENDPOINTS = {
  PDF_READER: `${API_URL}/extract_text/`,
  LOGIN: `${API_URL}/signin/`,
  SIGNUP: `${API_URL}/signup/`,
};
