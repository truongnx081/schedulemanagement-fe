import axiosInstance from "./AxiosConfig";

export const getEvent = () => {
  return axiosInstance
    .get(`/api/events`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Lỗi khi lấy thông tin sự kiện:", error);
      throw error;
    });
};

export const getAllEventByAreaAPI = (areaId) => {
  return axiosInstance.get('/api/events/area', {
    params: {
      areaId: areaId
    }
  });
};

export const createEventAPI = (formData) => {
  return axiosInstance.post('/api/events', formData);
};

export const updateEventAPI = (formData, id) => {
  return axiosInstance.put('/api/events', formData, {
    params: {
      id: id
    }
  });
};

export const deleteEventAPI = (id) => {
  return axiosInstance.delete('/api/events', {
    params: {
      id: id
    }
  });
};

export const importExcelEventAPI = (formData) => {
  return axiosInstance.post(`/api/events/excel/upload`, formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};
