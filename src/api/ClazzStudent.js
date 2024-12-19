import axiosInstance from './AxiosConfig';

export const getClazzByStudent =()=>{
    return axiosInstance.get(`/api/clazzs/clazzs-for-register`)
}

export const postClazzByStudent = (clazzId) => {
    return axiosInstance.post(`/api/studyins/register-clazz`, null, { 
        params: { clazzId },
    });
};
