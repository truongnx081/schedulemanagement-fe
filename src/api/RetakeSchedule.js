import axiosInstance from "./AxiosConfig";

export const createRetakeScheduleAPI = (retakeScheduleDTO) => {
  return axiosInstance
    .post("/api/retakeschedules/createRetakeSchedule", retakeScheduleDTO)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to create retake schedule:", error);
      throw error;
    });
};

export const getRetakeSchedule = (startDate, endDate) => {
  return axiosInstance
    .get(`/api/retakeschedules/getRetakeScheduleByInstructor`, {
      params: {
        startDate: startDate, // Pass startDate as a query param
        endDate: endDate, // Pass endDate as a query param
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin lịch dạy bù của giảng viên:", error);
      throw error;
    });
};
