import axiosInstance from "./AxiosConfig";

export const getAllSemesterAPI = () => {
  return axiosInstance
    .get("/api/semesters")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch all Semester:", error);
      throw error;
    });
};
