import axiosInstance from "./AxiosConfig";

export const getAllYearAPI = () => {
    return axiosInstance.get(`/api/years`);
}