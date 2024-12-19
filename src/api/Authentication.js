import axiosInstance from './AxiosConfig';

export const getToken = (email) => {
  return axiosInstance.post('/auth/token', { email })
    .then(response => {
      localStorage.setItem('token', response.data.token);
      return response;
    })
    .catch(error => {
      console.error("Error getting token:", error);
      throw error;
    });
};

export const introspect = (token) => {
  return axiosInstance.post('/auth/introspect', { token })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error("Error introspecting token:", error);
      throw error;
    });
};


export const logoutAPI = (token) => {
  return axiosInstance.post('/auth/logout', { token: token });
};


export const refreshToken = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  return axiosInstance.post('/auth/refresh', { refreshToken })
    .then(response => {
      localStorage.setItem('token', response.token);
      return response;
    })
    .catch(error => {
      console.error("Error refreshing token:", error);
      throw error;
    });
};
