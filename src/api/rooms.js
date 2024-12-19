import axiosInstance from "./AxiosConfig";

export const getAllRoomByAdminAreaAPI = () => {
  return axiosInstance.get("/api/rooms");
};

export const getAllRoomAvailableAPI = (shift, date) => {
  return axiosInstance
    .get("/api/rooms/get-available-rooms", {
      params: {
        shift: shift,
        date: date,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch all RoomAvailable:", error);
      throw error;
    });
};
