import axiosInstance from './AxiosConfig';

export const getAdminInforAPI = () => {
    return axiosInstance.get('/api/admins/adminInfor');
};
export const getStatisticByYear = (year) => {
    return axiosInstance.get(`/api/admins/statistic`,{
        params:{
            year:year
        }
    });
};