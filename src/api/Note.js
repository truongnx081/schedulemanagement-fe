import axiosInstance from "./AxiosConfig";

// get note theo ngày, tháng và năm
export const getAllNoteAPI = () => {
  return axiosInstance.get("/api/notes/getAllNote");
};

// get note theo ngày, tháng và năm
export const getNoteByDayAPI = (day, month, year) => {
  return axiosInstance.get("/api/notes/getNoteByDay", {
    params: {
      day: day,
      month: month,
      year: year,
    },
  });
};

// get note theo tháng và năm
export const getNoteByMonthAPI = (month, year) => {
  return axiosInstance.get("/api/notes/getNoteByMonth", {
    params: {
      month: month,
      year: year,
    },
  });
};

// Tạo ghi chú mới
export const createNoteAPI = (noteDTO) => {
  return axiosInstance.post("/api/notes/createNote", noteDTO);
};

// Cập nhật ghi chú
export const updateNoteAPI = (noteId, noteDTO) => {
  return axiosInstance.put(`/api/notes/updateNote`, noteDTO, {
    params: {
      noteId: noteId,
    },
  });
};

// Xóa ghi chú
export const deleteNoteAPI = (noteId) => {
  return axiosInstance.delete("/api/notes/deleteNote", {
    params: {
      noteId: noteId,
    },
  });
};
