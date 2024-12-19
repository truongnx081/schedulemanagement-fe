import axiosInstance from "./AxiosConfig";

export const getResultStudy = () => {
  return axiosInstance
    .get(`/api/studyResult/learningProgressByStudent`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin sinh viên:", error);
      throw error;
    });
};

export const getAllStudyResult = () => {
  return axiosInstance
    .get(`/api/studyResult`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Không lấy được danh sách các môn đã học:", error);
      throw error;
    });
};

//Lấy toàn bộ môn phải học trong chương trình đào tạo, nếu đã học qua phải hiện ra kết quả (Passed, Failed) và điểm trung bình
export const getStudyHistoryByStudentIdAPI = () => {
  return axiosInstance
    .get(`/api/studyResult/study-history`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin sinh viên:", error);
      throw error;
    });
};

//Lấy các môn đã học qua cùng với toàn bộ các cột điểm cũng như kết quả học tập
export const getMarkTableByStudentIdAPI = () => {
  return axiosInstance
    .get(`/api/studyResult/mark-table`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin sinh viên:", error);
      throw error;
    });
};

export const getMarkDetail = (studyInId) => {
  return axiosInstance
    .get(`api/studyResult/mark-detail`, {
      params: {
        studyInId: studyInId,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy bảng điểm chi tiết của sinh viên:", error);
      throw error;
    });
};

export const getMarkByClazzId = (clazzId) => {
  return axiosInstance
    .get(`api/studyResult/getMarkByClazzId`, {
      params: {
        clazzId: clazzId,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy bảng điểm chi tiết của sinh viên:", error);
      throw error;
    });
};

export const updateMarkForStudentAPI = async (
  studentId,
  clazzId,
  studyResultDTOS
) => {
  try {
    const response = await axiosInstance.put(
      "/api/studyResult/update-mark",
      studyResultDTOS,
      {
        params: { studentId, clazzId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating marks:", error);
    throw error;
  }
};
