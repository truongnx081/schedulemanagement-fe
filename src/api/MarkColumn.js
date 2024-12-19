import axiosInstance from './AxiosConfig';

export const getAllMarkColumnAPI = () => {
    return axiosInstance.get(`/api/markcolumns`);
};