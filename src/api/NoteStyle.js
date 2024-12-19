import axiosInstance from "./AxiosConfig";

// get note theo ngày, tháng và năm
export const geAllNoteTypeAPI = () => {
  return axiosInstance.get("/api/notetypes/geAllNoteType", {});
};
