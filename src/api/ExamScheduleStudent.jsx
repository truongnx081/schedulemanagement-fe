import axiosInstance from "./AxiosConfig";

export const getExamSchedule = (startDate, endDate) => {
  return axiosInstance.get(`/api/examschedules/getExamSchedules`, {
    params: { startDate, endDate },
  });
};
