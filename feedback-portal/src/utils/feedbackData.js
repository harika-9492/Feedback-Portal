import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://feedback-portal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const safeData = (value, fallback) => (value === undefined || value === null ? fallback : value);

export const initializeFeedbackData = () => {};

export const getUsers = async () => {
  const faculty = await getFacultyUsers();
  return faculty;
};

export const saveUsers = async () => {};

export const getForms = async () => {
  const { data } = await api.get("/forms");
  return safeData(data, []);
};

export const saveForms = async () => {};

export const getResponses = async () => {
  const { data } = await api.get("/responses");
  return safeData(data, []);
};

export const saveResponses = async () => {};

export const getFacultyUsers = async () => {
  const { data } = await api.get("/users/faculty");
  return safeData(data, []);
};

export const addFacultyUser = async ({ name, email, password, department }) => {
  try {
    const { data } = await api.post("/users/faculty", {
      name: name?.trim(),
      email: email?.trim()?.toLowerCase(),
      password,
      department: department?.trim(),
    });
    return { ok: !!data?.ok, message: data?.message || "Faculty account created." };
  } catch (error) {
    return {
      ok: false,
      message: error.response?.data?.message || "Unable to create faculty account.",
    };
  }
};

export const removeFacultyUser = async (email) => {
  await api.delete(`/users/faculty/${encodeURIComponent(email)}`);
};

export const createFeedbackForm = async (payload) => {
  const { data } = await api.post("/forms", payload);
  return data;
};

export const getStudentForms = async () => {
  const { data } = await api.get("/forms/student");
  return safeData(data, []);
};

export const getFacultyAssignedForms = async (facultyEmail) => {
  const { data } = await api.get(`/forms/faculty/${encodeURIComponent(facultyEmail)}`);
  return safeData(data, []);
};

export const submitFormResponse = async (responsePayload) => {
  const { data } = await api.post("/responses", responsePayload);
  return data;
};

export const hasStudentSubmitted = async (formId, studentEmail) => {
  const { data } = await api.get("/responses/check", {
    params: { formId, studentEmail },
  });
  return !!data?.submitted;
};

export const getAnalyticsByForm = async () => {
  const { data } = await api.get("/analytics");
  return safeData(data, {});
};

export const refreshAnalyticsData = async () => getAnalyticsByForm();
