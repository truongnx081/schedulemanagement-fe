import axiosInstance from './AxiosConfig';

export const getAllPrivateMajorAPI = () => {
    return axiosInstance.get('/api/privatemajors');
};