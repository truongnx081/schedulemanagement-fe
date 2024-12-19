import axiosInstance from "./AxiosConfig";

export const doArrangeBatchAPI = async (arrangeBatchDTOS) => {
  try {
    const response = await axiosInstance.put(
      "/api/arrangebatchs/do-arrange-batch",
      arrangeBatchDTOS
    );
    return response.data;
  } catch (error) {
    console.error("Error arranging batch:", error);
    throw error;
  }
};
