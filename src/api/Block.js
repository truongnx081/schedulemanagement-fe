import axiosInstance from "./AxiosConfig";

export const getAllBlocksAPI = () => {
  return axiosInstance
    .get("/api/blocks")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch all block:", error);
      throw error;
    });
};
