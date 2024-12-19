import axiosInstance from "./AxiosConfig";

export const getAllClazzsByBlockAndSemesterAndYearAPI = (
  block,
  semester,
  year
) => {
  return axiosInstance.get("/api/clazzs/for-admin", {
    params: {
      block: block,
      semester: semester,
      year: year,
    },
  });
};

export const createClazzAPI = (clazz) => {
  return axiosInstance.post("/api/clazzs", clazz);
};

export const updateClazzAPI = (clazzId, clazz) => {
  return axiosInstance.put(`/api/clazzs/${clazzId}`, clazz);
};

export const deleteClazzAPI = (clazzId) => {
  return axiosInstance.put(`/api/clazzs/${clazzId}`);
};

export const importExcelClazzAPI = (formData) => {
  return axiosInstance.post(`/api/clazzs/excel/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getClazzesByInstructor = (block, semester, year) => {
  return axiosInstance
    .get(`/api/clazzs/getClazzesByInstructor`, {
      params: {
        block: block,
        semester: semester,
        year: year,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("ERROR TAKE CLAZZ LIST OF INSTRUCTOR:", error);
      throw error;
    });
};

export const getAllClazzAPI = () => {
  return axiosInstance.get(`/api/clazzs`);
};

//Lấy tất cả các lớp học mà sinh viên đã đăng ký trong block, semester, year hiện tại
export const getRegistedClazzes = async () => {
  try {
    const response = await axiosInstance.get('/api/clazzs/registed-clazzes');
    return response.data;
  } catch (error) {
    console.error("Error fetching registered classes:", error);
    throw error;
  }
};

export const getClazzesToChangeShiftBySubjectIdAndShiftAPI = (subjectId, shift) => {
  return axiosInstance.get(`/api/clazzs/clazzes-to-change`, {
    params: {
      subjectId: subjectId,
      shift: shift,
    }
  });
};
