import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { getToken, introspect } from "../../api/Authentication.js";
import { jwtDecode } from "jwt-decode";
import { getUserScope } from "../../utils/authUtils.ts";
import icon from "../../images/logo.png";

function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = async (response) => {
    try {
      const googleToken = response.credential;
      const decodedToken = jwtDecode(googleToken);
      await getToken(decodedToken.email);

      const role = getUserScope();
      console.log(role);
      if (
        role === "ROLE_ADMIN" ||
        role === "ROLE_STUDENT" ||
        role === "ROLE_INSTRUCTOR"
      ) {
        navigate("/");
        window.location.reload();
      } else {
        alert("Tài khoản không đúng. Vui lòng thử lại.");
        navigate("/dang-nhap");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleLoginFailure = (error) => {
    console.error(error);
  };

  return (
    <div className="fixed top-0 left-0 z-50 bg-white w-screen h-full border flex">
      <div className="w-full h-full bg-white border">
        <img
          src="https://www.shutterstock.com/image-vector/home-office-desk-pedestal-drawer-600nw-496837279.jpg"
          alt=""
          className="w-1/2 object-cover"
        />
      </div>
      <div className="w-full h-full absolute bg-transparent flex items-start justify-end p-24 px-28">
        <GoogleOAuthProvider clientId="276809712128-5574t4arhjnv53n3pubg71cmhh802r9t.apps.googleusercontent.com">
          <div className="flex flex-col items-center p-10 bg-white rounded-md w-6/12 h-full">
            <img src={icon} alt="" className="w-1/3" />
            <h2 className="font-medium text-black text-2xl tracking-widest mb-1 uppercase">
              Welcome to
            </h2>
            <h2 className="font-medium text-black text-2xl tracking-widest mb-10 uppercase">
              Schedule Management Website
            </h2>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
            />
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default Login;
