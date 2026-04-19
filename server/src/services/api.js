import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchHostIntel = async (ip) => {
  const response = await API.get(`/shodan/host/${ip}`);
  return response.data;
};
