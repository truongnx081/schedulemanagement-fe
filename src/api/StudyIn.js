import axiosInstance from "./AxiosConfig";

export const registerClass = async (clazzId) => {
  try {
    const response = await axiosInstance.post("/api/studyins/register", null, {
      params: {
        clazzId: clazzId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering class:", error);
    throw error;
  }
};

export const deleteClazz = async (clazzId) => {
  try {
    const response = await axiosInstance.delete('api/studyins/delete', {
      params: { clazzId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

export const updateAllStudyInIsTrueByStudent = () => {
  return axiosInstance.put("/api/studyins/student");
};

export const getAllIdOfStudyInByBlockAndSemesterAndYearOfStudent2API = () => {
  return axiosInstance.get("/api/studyins/student");
};

export const handleChangeClazzAPI = (oldClazzId, newClazzId) => {
  return axiosInstance.put("/api/studyins/change-clazz", null, {
    params: {
      oldClazzId: oldClazzId,
      newClazzId: newClazzId
    }
  });
};
