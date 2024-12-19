import axiosInstance from "./AxiosConfig";

export const getTeacherSchedule = (startDate, endDate) => {
  return axiosInstance
    .get(`/api/instructors/getAllTeachingSchedule`, {
      params: {
        startDate: startDate, // Pass startDate as a query param
        endDate: endDate, // Pass endDate as a query param
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin lịch dạy của giảng viên:", error);
      throw error;
    });
};
