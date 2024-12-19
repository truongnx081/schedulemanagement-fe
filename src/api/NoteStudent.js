import axiosInstance from "./AxiosConfig";

export const postNote = (note) => {
  return axiosInstance.post(`/api/notes/createNote`, note);
};


export const updateNote = (noteId, note) => {
  return axiosInstance.put(`/api/notes/updateNote`, note, {
    params: { noteId },
  });
};

export const deleteNote = (noteId) => {
  return axiosInstance.delete(`/api/notes/deleteNote`, {
    params: { noteId },
  });
};



  export const getNotesByMonth = (month, year) => {
    return axiosInstance.get(`/api/notes/getNoteByMonth`, {
      params: { month, year }, 
    });
  };