import axiosInstance from './AxiosConfig';

export const getAllAreaAPI = () => {
    return axiosInstance.get('/api/areas');
};