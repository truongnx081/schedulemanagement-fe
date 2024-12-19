import axiosInstance from "./AxiosConfig";

export const getStudentInfo = () => {
  return axiosInstance.get(`/api/students/studentInfor`);
};

export const updateStudentByStudent = (studentData, file) => {
  const formData = new FormData();
  formData.append("request", JSON.stringify(studentData)); // Append student data (as JSON)

  if (file) {
    formData.append("file", file); // Append file (avatar) if it exists
  } else {
    // Fallback if no file is selected (you can customize this)
    formData.append("file", "1.png_20241028103613.jpg");
  }

  return axiosInstance
    .put("/api/students/updateStudentByStudent", formData)
    .then((response) => {
      return response.data; // Return the updated student data
    })
    .catch((error) => {
      console.error("Error updating student info:", error);
      throw error; // Throw error to be caught in the handleSubmit function
    });
};

export const getAllStudentbyCourseAndMajor = (course, majorId) => {
  return axiosInstance
    .get(`/api/students/getAllStudentByCourseAndMajor`, {
      params: {
        course: course,
        majorId: majorId,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin lịch dạy của giảng viên:", error);
      throw error;
    });
};

export const updateImageAPI = (id, formData) => {
  return axiosInstance.put(`/api/students/update-image/${id}`, formData);
};

export const createStudentAPI = (formData) => {
  return axiosInstance.post(`/api/students/createStudent`, formData);
};

export const updateStudentByAdminAPI = (id, formData) => {
  return axiosInstance.put(`/api/students/updateStudentByAdmin`, formData, {
    params: {
      studentId: id,
    },
  });
};

export const importExcelStudentAPI = (formData) => {
  return axiosInstance.post("/api/students/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteStudentAPI = (id) => {
  return axiosInstance.delete(`/api/students/deleteStudent`, {
    params: {
      id: id,
    },
  });
};

export const getAllStudentbyClazzId = (clazzId) => {
  return axiosInstance
    .get(`/api/students/getStudentsByInstructorIdAndClazzId`, {
      params: {
        clazzId: clazzId,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy danh sách sinh viên theo clazz ID:", error);
      throw error;
    });
};

export const getAllCourse = () => {
  return axiosInstance
    .get("/api/students/course")
    .then((response) => response.data)
    .catch((error) => {
      console.error("Failed to fetch all specializations:", error);
      throw error;
    });
};

export const countStudentCannotPresent = (scheduleId, date, shift) => {
  return axiosInstance.put(`/api/students/cannot-present`, {
    params: {
      scheduleId: scheduleId,
      date: date,
      shift: shift,
    },
  });
};

export const getStudentsByInstructorIdAndClazzIdAPI = async (clazzId) => {
  try {
    const response = await axiosInstance.get(
      "/api/students/getStudentsByInstructorIdAndClazzId",
      {
        params: { clazzId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentWithQualifiByClazzIdAPI = async (clazzId) => {
  try {
    const response = await axiosInstance.get(
      "/api/students/students-for-arrange-batch",
      {
        params: { clazzId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching qualified students:", error);
    throw error;
  }
};
