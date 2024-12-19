import axiosInstance from "./AxiosConfig";

export const getAllSpecializationsAPI = () => {
  return axiosInstance
    .get("/api/specializations")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch all specializations:", error);
      throw error;
    });
};
