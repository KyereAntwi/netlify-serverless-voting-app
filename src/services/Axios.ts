import axios from "axios";

const config = {
  baseURL: "/.netlify/functions",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

const getAxiosConfig = async () => {
  const token = localStorage.getItem("token") || "";

  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };
  }

  return config;
};

const createAxiosInstance = async () => {
  const axiosConfig = await getAxiosConfig();
  const controller = new AbortController();
  return axios.create({
    ...axiosConfig,
    signal: controller.signal,
  });
};

export default createAxiosInstance;
