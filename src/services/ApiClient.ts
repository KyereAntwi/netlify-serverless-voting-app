import type { AxiosInstance } from "axios";
import createAxiosInstance from "./Axios";

let axiosInstance: AxiosInstance;

async function initializeAxios() {
  axiosInstance = await createAxiosInstance();

  axiosInstance.interceptors.response.use((config) => {
    return config;
  });
}

initializeAxios();

const apiClient = {
  async get(url: string) {
    return axiosInstance.get(url, {
      method: "GET",
    });
  },

  async post<TRequest>(url: string, data: TRequest, options?: Object) {
    return await axiosInstance.post(
      url,
      data,
      options ?? {
        method: "POST",
      }
    );
  },

  async put<TRequest>(url: string, data: TRequest, options?: Object) {
    return await axiosInstance.put(
      url,
      data,
      options ?? {
        method: "PUT",
      }
    );
  },

  async delete(url: string) {
    return await axiosInstance.delete(url, {
      method: "DELETE",
    });
  },
};

export default apiClient;
