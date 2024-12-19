import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../component/Spinner.tsx';
import { logoutAPI } from '../api/Authentication.js';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            let token = localStorage.getItem('token')
            let response = await logoutAPI(token);
            if (response.statusCode === 200) {
                localStorage.removeItem('token');
                navigate('/dang-nhap');
                window.location.reload();
            }
        } catch (error) {
            console.log("Lỗi đăng xuất: ", error)
        }

    }

    useEffect(() => {

        handleLogout()

    }, [navigate]);

    return <div className="flex justify-center gap-5 items-center min-h-screen">
        <Spinner className="w-55 h-55" />
        <span className="text-gray-500 text-xl">Đang đăng xuất...</span>
    </div>;
};

export default LogoutPage;