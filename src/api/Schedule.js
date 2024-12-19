import axiosInstance from "./AxiosConfig";

// câph nhật trạng thái lịch dạy của giảng viên
export const cancelSchedule = (scheduleId, request) => {
  return axiosInstance
    .put(`/api/schedules/cancelSchedule`, request, {
      params: {
        scheduleId: scheduleId, // Pass scheduleId as a query param
      },
    })
    .then((response) => {
      return response.data; // Return response data directly
    })
    .catch((error) => {
      console.error(
        `Lỗi khi cập nhật trạng thái lịch học cho scheduleId ${scheduleId}:`,
        error
      );
      throw error;
    });
};

//Lấy lịch học theo id
// Function to get the schedule data by ID
export const getScheduleById = (scheduleId) => {
  return axiosInstance
    .get(`api/schedules/${scheduleId}`) // Make sure this is the correct endpoint
    .then((response) => {
      return response.data; // Assuming the response structure is correct
    })
    .catch((error) => {
      console.error(
        `Error fetching value for scheduleId ${scheduleId}:`,
        error // Log the error for debugging
      );
      throw error; // Throw the error to be handled by the caller
    });
};

// GET NHƯNG NGÀY ĐÃ HUỶ CỦA GIẢNG VIÊN
export const getScheduleStatusFalse = () => {
  return axiosInstance
    .get(`/api/schedules/getscheduleStatusFalse`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin ngày đã huỷ:", error);
      throw error;
    });
};

export const getAllByBlockAndSemesterAndYear = (block, semester, year) => {
  return axiosInstance
    .get(`/api/schedules/getByBlockSemesterYear/admin`, {
      params: {
        block: block,
        semester: semester,
        year: year,
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

export const createScheduleAPI = (formData) => {
  return axiosInstance.post('/api/schedules', formData);  
};

export const updateScheduleAPI = (formData, id) => {
  return axiosInstance.put(`/api/schedules/${id}`, formData);
};

export const importExcelScheduleAPI = (formData) => {
  return axiosInstance.post(`/api/schedules/excel/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
