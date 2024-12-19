import axiosInstance from './AxiosConfig';

export const getInstructorInforAPI = () => {
    return axiosInstance.get('/api/instructors/instructorInfor');
};

export const getAllInstructorBySpecializationIdAPI = (specializationId) => {
    return axiosInstance.get('/api/instructors', {
        params: {
            specializationId: specializationId
        }
    });
};

export const createInstructorAPI = (instructor) => {
    return axiosInstance.post('/api/instructors', instructor);
};

export const updateInstructorAPI = (instructorId, instructor) => {
    return axiosInstance.put(`/api/instructors/${instructorId}`, instructor);
};

export const deleteInstructorAPI = (instructorId) => {
    return axiosInstance.delete(`/api/instructors/${instructorId}`);
};

export const importExcelInstructorAPI = (formData) => {
    return axiosInstance.post(`/api/instructors/excel/upload`, formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
};