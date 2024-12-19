import axiosInstance from "./AxiosConfig";

export const getAllExamSchedule = () => {
  return axiosInstance
    .get(`/api/examschedules`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin lịch thi:", error);
      throw error;
    });
};

export const getAllExambyBlockSemesterYearSpecialization = (
  block,
  semester,
  year,
  specializationId
) => {
  return axiosInstance
    .get(`/api/examschedules/admin/sort`, {
      params: {
        block: block,
        semester: semester,
        year: year,
        specializationId: specializationId,
      },
    })
    .then((response) => {
      return response.data; // Return response data directly
    })
    .catch((error) => {
      console.error(`Lỗi khi lấy ds sách lịch học:`, error);
      throw error;
    });
};

export const createExamScheduleAPI = (formData) => {
  return axiosInstance.post('/api/examschedules', formData);
};

export const updateExamScheduleAPI = (formData, id) => {
  return axiosInstance.put(`/api/examschedules/${id}`, formData);
};

export const importExcelExamScheduleAPI = (formData) => {
  return axiosInstance.post(`/api/examschedules/excel/upload`, formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
