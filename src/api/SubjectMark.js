import axiosInstance from "./AxiosConfig";

export const getSubjectMarkBySubjectIdAPI = (subjectId) => {
    return axiosInstance.get("/api/subjectmarks/subject", {
        params: {
            subjectId: subjectId,
        }
    });
};

export const getSubjectMarkByClazzIdAPI = async (clazzId) => {
  try {
    const response = await axiosInstance.get(
      "api/subjectmarks/subject-mark-by-clazz",
      {
        params: { clazzId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching subject marks:", error);
    throw error;
  }
};