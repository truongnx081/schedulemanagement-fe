import axiosInstance from "./AxiosConfig";

export const paymentAPI = (payments) => {
    return axiosInstance.post('/api/payment/create-payment-link', payments)
}