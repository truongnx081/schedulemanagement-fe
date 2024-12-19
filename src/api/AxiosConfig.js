import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout:300000,
  headers: {
    Accept: 'application/json',
  },
});

//Interceptor xử lý request trước khi gửi đi
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const isLoginPage = window.location.pathname === "/dang-nhap";

    if (!isLoginPage && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//Interceptor xử lý response
axiosInstance.interceptors.response.use(
  response => {
    return response.data;

  },
  error => {
    let res = {};
    if (error.response) {
      res.data = error.response.data; // Dữ liệu lỗi từ server
      res.status = error.response.status; // Mã trạng thái lỗi
      res.headers = error.response.headers; // Header từ phản hồi
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(res);
  }
);


export default axiosInstance; 
