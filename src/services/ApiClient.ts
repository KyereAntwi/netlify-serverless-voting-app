import createAxiosInstance from "./Axios";

const apiClient = {
  async get(url: string) {
    const axiosInstance = await createAxiosInstance();
    return axiosInstance.get(url, {
      method: "GET",
    });
  },

  async post<TRequest>(url: string, data: TRequest, options?: Object) {
    const axiosInstance = await createAxiosInstance();
    return await axiosInstance.post(
      url,
      data,
      options ?? {
        method: "POST",
      }
    );
  },

  async put<TRequest>(url: string, data: TRequest, options?: Object) {
    const axiosInstance = await createAxiosInstance();
    return await axiosInstance.put(
      url,
      data,
      options ?? {
        method: "PUT",
      }
    );
  },

  async delete(url: string) {
    const axiosInstance = await createAxiosInstance();
    return await axiosInstance.delete(url, {
      method: "DELETE",
    });
  },
};

export default apiClient;
