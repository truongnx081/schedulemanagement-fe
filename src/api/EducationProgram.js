import axiosInstance from './AxiosConfig';

export const getAllEducationProgramAPI = () => {
    return axiosInstance.get('/api/educationprograms');
};

export const createApplyForEducationAPI = (formData) => {
    return axiosInstance.post('/api/educationprograms', formData);
};

export const updateApplyForEducationAPI = (formData, educationProgramId) => {
    return axiosInstance.put('/api/educationprograms', formData,
        {
            params: {
                educationProgramId: educationProgramId
            }
        }
    );
};