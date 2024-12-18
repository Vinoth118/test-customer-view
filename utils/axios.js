import client from "axios";

const axios = client.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
axios.interceptors.request.use((config) => {
  if (process.browser) {
    config.headers = {
      ...config.headers,
      "access-token": localStorage.getItem("token"),
    };
  }

  return config;
});

export default axios;