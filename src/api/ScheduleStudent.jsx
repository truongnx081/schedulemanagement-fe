import axiosInstance from "./AxiosConfig";

export const getSchedule = (startDate, endDate) => {
  return axiosInstance.get(`/api/schedules/getSchedules`, {
    params: { startDate, endDate },
  });
};

export const calculateDates = (days) => {
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setDate(currentDate.getDate() + days);
  return {
    startTime: currentDate.toISOString().split("T")[0],  
    endTime: endDate.toISOString().split("T")[0],     
  };
};
