import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export const fetchHostIntel = async (ip) => {
  const response = await API.get(`/shodan/host/${ip}`);
  return response.data;
};

export const fetchAttackSurface = async (domain) => {
  const response = await API.get(`/attack-surface/scan/${domain}`);
  return response.data;
};

export const downloadCasePdfReport = async (caseId, reportContext = {}) => {
  const response = await API.post(
    `/reports/case/${caseId}/pdf`,
    reportContext,
    {
      responseType: "blob",
    },
  );

  return response.data;
};
