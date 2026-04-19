import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
  const url = `/reports/case/${caseId}/pdf`;
  console.log("PDF API URL", url);

  const response = await API.post(url, reportContext, {
    responseType: "blob",
  });

  return response.data;
};
