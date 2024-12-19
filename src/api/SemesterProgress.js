import axiosInstance from "./AxiosConfig";

export const getAllSemesterProgressByAdmin = () => {
  return axiosInstance
    .get(`/api/semesterprogresses/getAllSP`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Không lấy được danh sách Semester Progress:", error);
      throw error;
    });
};

export const updateDefaultSemesterProgress = (id) => {
  return axiosInstance.put(
    "/api/semesterprogresses/update-status-default",
    null,
    {
      params: {
        id: id,
      },
    }
  );
};

export const createSemesterProgressAPI = (formData) => {
  return axiosInstance.post("/api/semesterprogresses/createSP", formData);
};

export const updateSemesterProgressAPI = (formData, id) => {
  return axiosInstance.put(`/api/semesterprogresses/updateSP/${id}`, formData);
};

export const importExcelSemesterProgressAPI = (formData) => {
  return axiosInstance.post(`/api/semesterprogresses/excel/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getCurrentProgressAPI = () => {
  return axiosInstance.get(`/api/semesterprogresses/current-progress`);
};
