import axiosInstance from "./AxiosConfig";

export const getAllSubject = () => {
  return axiosInstance
    .get(`/api/subjects/getAllSubject`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin sinh viên:", error);
      throw error;
    });
};

export const getAllSubjectBySpecializationIdAPI = (specializationId) => {
  return axiosInstance.get('/api/subjects/getAllSubjectBySpecializationId', {
    params: {
      specializationId: specializationId
    }
  });
};

export const getAllByEducationProgramId = (educationProgramId) => {
  return axiosInstance.get('/api/subjects',
    {
      params: {
        educationProgramId: educationProgramId
      }
    }
  );
};

export const createSubjectAPI = (formDate) => {
  return axiosInstance.post('/api/subjects', formDate);
};

export const updateSubjectAPI = (formDate, subjectId) => {
  return axiosInstance.put('/api/subjects', formDate,
    {
      params: {
        subjectId: subjectId
      }
    }
  );
};

export const deleteSubjectAPI = (subjectId) => {
  return axiosInstance.delete('/api/subjects',
    {
      params: {
        subjectId: subjectId
      }
    }
  );
};

export const importExcelSubjectAPI = (formData) => {
  return axiosInstance.post(`/api/subjects/excel/upload`, formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
