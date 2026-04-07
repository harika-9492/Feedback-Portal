const DEFAULT_API_HOST = "https://feedback-portal-production.up.railway.app";

export const getApiBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_HOST).trim();
  const normalized = raw.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
};
